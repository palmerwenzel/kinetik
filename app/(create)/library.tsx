import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useMediaLibrary } from "@/lib/media/useMediaLibrary";
import { router } from "expo-router";
import { useToast } from "@/hooks/useToast";

export default function LibraryScreen() {
  const { pickVideo, isLoading } = useMediaLibrary();
  const toast = useToast();

  const handlePickVideo = async () => {
    try {
      const result = await pickVideo({
        allowsEditing: true,
        videoMaxDuration: 60,
      });

      if (result?.uri) {
        router.push({
          pathname: "/(create)/preview",
          params: { videoUri: result.uri },
        });
      }
    } catch (error) {
      console.error("Error picking video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to pick video. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Button
        variant="flat-accent"
        onPress={handlePickVideo}
        disabled={isLoading}
        className="px-8 py-4"
      >
        <Text className="text-lg">{isLoading ? "Selecting..." : "Choose a Video"}</Text>
      </Button>
    </View>
  );
}
