import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useToast } from "@/hooks/useToast";

export default function EditScreen() {
  const { videoUri } = useLocalSearchParams<{ videoUri: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handlePublish = async () => {
    if (!videoUri) {
      toast.error("No video selected");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement video upload to Firebase Storage
      router.replace("/(app)");
    } catch (error) {
      console.error("Error publishing video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to publish video. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!videoUri) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No video selected</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Video
          source={{ uri: videoUri }}
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
        </ScrollView>
      </View>

      <View className="p-4 flex-row justify-between items-center bg-black">
        <Button variant="flat-transparent" onPress={() => router.back()} className="flex-1 mr-2">
          <Ionicons name="arrow-back" size={24} color="white" className="mr-2" />
          <Text>Back</Text>
        </Button>

        <Button
          variant="flat-accent"
          onPress={handlePublish}
          disabled={isLoading}
          className="flex-1 ml-2"
        >
          <Ionicons name="cloud-upload" size={24} color="white" className="mr-2" />
          <Text>{isLoading ? "Publishing..." : "Publish"}</Text>
        </Button>
      </View>
    </View>
  );
}
