/**
 * Hook for accessing device media library and selecting videos
 */
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

interface MediaLibraryOptions {
  allowsEditing?: boolean;
  quality?: number;
  videoMaxDuration?: number;
}

export function useMediaLibrary() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Sorry, we need media library permissions to make this work!");
      }
    }
  }, []);

  const pickVideo = useCallback(
    async (options: MediaLibraryOptions = {}) => {
      setIsLoading(true);
      try {
        await requestPermission();

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: options.allowsEditing ?? true,
          quality: options.quality ?? 1,
          videoMaxDuration: options.videoMaxDuration ?? 60,
        });

        if (!result.canceled && result.assets[0]) {
          return result.assets[0];
        }
        return null;
      } catch (error) {
        console.error("Error picking video:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [requestPermission]
  );

  return {
    pickVideo,
    isLoading,
  };
}
