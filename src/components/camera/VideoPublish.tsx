import React, { useState } from "react";
import { View, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ControlledSelect } from "@/components/ui/ControlledSelect";
import { useUserGroups } from "@/hooks/useUserGroups";
import { INTERESTS } from "@/lib/constants/interests";
import { processVideoForUpload } from "@/lib/video/videoProcessor";
import { uploadVideo, type UploadProgress } from "@/lib/firebase/storage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useToast } from "@/hooks/useToast";
import * as VideoThumbnails from "expo-video-thumbnails";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { DbVideo } from "@/types/firebase/firestoreTypes";

interface VideoPublishProps {
  uri: string;
  onCancel: () => void;
}

export function VideoPublish({ uri, onCancel }: VideoPublishProps) {
  const [caption, setCaption] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"interests" | "groups" | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const { groups, isLoading: isLoadingGroups } = useUserGroups();
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Generate thumbnail on mount
  React.useEffect(() => {
    const generateVideoThumbnail = async () => {
      try {
        const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(uri, {
          time: 0,
        });
        setThumbnail(thumbnailUri);
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    };
    generateVideoThumbnail();
  }, [uri]);

  const handlePublish = async () => {
    if (!uri || !user) {
      toast.error("Unable to publish video. Please try again.");
      return;
    }

    // Show errors if validation fails
    if (caption.length === 0 || selectedInterests.length === 0) {
      setShowErrors(true);
      if (caption.length === 0) {
        toast.error("Please add a caption to your video.");
      } else if (selectedInterests.length === 0) {
        toast.error("Please select at least one interest for your video.");
      }
      return;
    }

    setIsPublishing(true);
    try {
      // Process video (generate thumbnail, compress)
      const processedVideo = await processVideoForUpload(uri);

      // Upload to Firebase Storage
      const uploadedVideo = await uploadVideo(user.uid, processedVideo, progress => {
        setUploadProgress(progress);
      });

      // Create Firestore document
      const videoDoc: Omit<DbVideo, "createdAt" | "updatedAt"> = {
        caption,
        interests: selectedInterests,
        groups: selectedGroups,
        videoUrl: uploadedVideo.videoUrl,
        thumbnailUrl: uploadedVideo.thumbnailUrl,
        duration: uploadedVideo.duration,
        size: uploadedVideo.size,
        createdBy: user.uid,
        likes: 0,
        comments: 0,
        shares: 0,
        isActive: true,
        isProcessed: true,
      };

      await addDoc(collection(db, "videos"), {
        ...videoDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Video published successfully!");
      router.replace("/(app)");
    } catch (error) {
      console.error("Error publishing video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to publish video. Please try again."
      );
    } finally {
      setIsPublishing(false);
      setUploadProgress(null);
    }
  };

  const getUploadStatus = () => {
    if (!uploadProgress) return "";
    const percent = Math.round(uploadProgress.progress);
    const uploaded = (uploadProgress.bytesTransferred / 1024 / 1024).toFixed(1);
    const total = (uploadProgress.totalBytes / 1024 / 1024).toFixed(1);
    return `Uploading: ${percent}% (${uploaded}MB / ${total}MB)`;
  };

  const getErrorMessage = () => {
    if (!showErrors) return null;
    if (caption.length === 0) return "Please add a caption";
    if (selectedInterests.length === 0) return "Please select at least one interest";
    return null;
  };

  const groupOptions = groups.map(group => ({
    label: group.name,
    value: group.id,
    description: group.description,
  }));

  const interestOptions = INTERESTS.map(interest => ({
    label: interest.label,
    value: interest.id,
  }));

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActiveDropdown(null);
        Keyboard.dismiss();
      }}
    >
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-4 py-12">
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-1" />
              <Text size="xl" weight="bold" className="flex-1 text-center">
                New Post
              </Text>
              <View className="flex-1 items-end">
                {isPublishing ? (
                  <LoadingSpinner />
                ) : (
                  <Button variant="flat-transparent" onPress={onCancel}>
                    <Ionicons name="close" size={24} color="white" />
                  </Button>
                )}
              </View>
            </View>

            {/* Thumbnail */}
            <View className="items-center mb-12">
              {thumbnail ? (
                <Image
                  source={{ uri: thumbnail }}
                  className="w-32 h-44 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-32 h-44 rounded-lg bg-surface-dark items-center justify-center">
                  <LoadingSpinner />
                </View>
              )}
            </View>

            {/* Caption */}
            <View className="mb-6">
              <Input
                variant="neu-surface"
                label={`Caption (${caption.length}/100)`}
                placeholder="Write a caption..."
                value={caption}
                onChangeText={text => setCaption(text.slice(0, 100))}
                maxLength={100}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Dropdowns */}
            <View className="mb-6">
              <ControlledSelect
                label="Interests"
                placeholder="Select interests"
                options={interestOptions}
                value={selectedInterests}
                onChange={setSelectedInterests}
                searchable
                isOpen={activeDropdown === "interests"}
                onOpenChange={isOpen => setActiveDropdown(isOpen ? "interests" : null)}
                zIndex={20}
              />
            </View>

            <View className="mb-6">
              <ControlledSelect
                label="Share to Groups (Optional)"
                placeholder="Select groups to share with"
                options={groupOptions}
                value={selectedGroups}
                onChange={setSelectedGroups}
                searchable
                isDisabled={isLoadingGroups || isPublishing}
                isOpen={activeDropdown === "groups"}
                onOpenChange={isOpen => setActiveDropdown(isOpen ? "groups" : null)}
                zIndex={10}
              />
            </View>

            <View className="flex-1" />

            <View className="mt-8">
              {showErrors && getErrorMessage() && (
                <Text className="text-error text-center mb-2">{getErrorMessage()}</Text>
              )}
              <Button
                variant="neu-accent"
                onPress={handlePublish}
                disabled={isPublishing}
                isLoading={isPublishing}
                className={showErrors && getErrorMessage() ? "bg-error border-error" : ""}
              >
                {isPublishing ? (
                  <Text className="text-white">
                    {uploadProgress ? getUploadStatus() : "Processing..."}
                  </Text>
                ) : (
                  <Text className="text-white">Publish</Text>
                )}
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
