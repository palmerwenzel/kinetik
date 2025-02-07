import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

interface VideoPreviewProps {
  uri: string;
  onSave: (uri: string) => void;
  onRetake: () => void;
}

export function VideoPreview({ uri, onSave, onRetake }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[VideoPreview] Mounting with URI:", uri);
    return () => {
      console.log("[VideoPreview] Unmounting");
    };
  }, [uri]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log("[VideoPreview] Playback status update:", status);

    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setError(null);
    } else {
      console.log("[VideoPreview] Video not loaded:", status);
      if (status.error) {
        setError(status.error);
      }
    }
  };

  const handleError = (error: string) => {
    console.error("[VideoPreview] Video error:", error);
    setError(error);
    setIsLoading(false);
  };

  console.log("[VideoPreview] Current state:", { isPlaying, isLoading, error });

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Video
          source={{ uri }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={handleError}
          style={{ flex: 1, backgroundColor: "black" }}
          useNativeControls={false}
        />

        {isLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {error && (
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-red-500">Error loading video: {error}</Text>
          </View>
        )}

        <TouchableOpacity
          className="absolute inset-0 items-center justify-center"
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {!isPlaying && !isLoading && !error && (
            <View className="w-20 h-20 rounded-full bg-black/50 items-center justify-center">
              <Ionicons name="play" size={36} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="p-4 flex-row justify-between items-center bg-black/90">
        <Button variant="flat-transparent" onPress={onRetake} className="flex-1 mr-2">
          <Ionicons name="camera-reverse" size={24} color="white" className="mr-2" />
          <Text>Retake</Text>
        </Button>

        <Button variant="flat-accent" onPress={() => onSave(uri)} className="flex-1 ml-2">
          <Ionicons name="checkmark" size={24} color="white" className="mr-2" />
          <Text>Use Video</Text>
        </Button>
      </View>
    </View>
  );
}
