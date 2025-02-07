import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { processVideoForUpload } from "@/lib/video/videoProcessor";
import { uploadVideo, type UploadProgress } from "@/lib/firebase/storage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useToast } from "@/hooks/useToast";

interface VideoEditorProps {
  uri: string;
  onBack: () => void;
  onRetake: () => void;
}

export function VideoEditor({ uri, onBack, onRetake }: VideoEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handlePublish = async () => {
    if (!uri || !user) {
      toast.error("Unable to publish video. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      // Process video (generate thumbnail, compress)
      const processedVideo = await processVideoForUpload(uri);

      // Upload to Firebase Storage
      await uploadVideo(user.uid, processedVideo, progress => {
        setUploadProgress(progress);
      });

      // TODO: Create post in Firestore with video details

      toast.success("Video published successfully!");
      router.replace("/(app)");
    } catch (error) {
      console.error("Error publishing video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to publish video. Please try again."
      );
    } finally {
      setIsLoading(false);
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

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Video
          source={{ uri }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          className="flex-1"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="absolute bottom-0 p-4 bg-black/90"
        >
          <TouchableOpacity className="items-center mx-2">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
              <Ionicons name="musical-notes" size={24} color="white" />
            </View>
            <Text className="text-white text-xs">Music</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mx-2">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
              <Ionicons name="cut" size={24} color="white" />
            </View>
            <Text className="text-white text-xs">Trim</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mx-2">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
              <Ionicons name="color-filter" size={24} color="white" />
            </View>
            <Text className="text-white text-xs">Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mx-2">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
              <Ionicons name="text" size={24} color="white" />
            </View>
            <Text className="text-white text-xs">Text</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mx-2">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
              <Ionicons name="happy" size={24} color="white" />
            </View>
            <Text className="text-white text-xs">Stickers</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View className="p-4 flex-row justify-between items-center bg-black">
        <Button
          variant="flat-transparent"
          onPress={onBack}
          className="flex-1 mr-2"
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="white" className="mr-2" />
          <Text>Back</Text>
        </Button>

        <Button
          variant="flat-accent"
          onPress={handlePublish}
          disabled={isLoading}
          className="flex-1 ml-2"
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="white" className="mr-2" />
              <Text className="text-sm">
                {uploadProgress ? getUploadStatus() : "Processing..."}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={24} color="white" className="mr-2" />
              <Text>Publish</Text>
            </>
          )}
        </Button>
      </View>
    </View>
  );
}
