import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CreateScreen() {
  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" className="flex-1 px-4 py-12">
        <View className="flex-1 items-center justify-center">
          <View className="mb-6">
            <Text size="3xl" weight="bold" className="text-center">
              Create
            </Text>
            <Text intent="muted" className="text-center mb-8">
              Share your journey
            </Text>
          </View>

          <View className="flex-col gap-y-4">
            <Button
              variant="neu-pressed"
              className="w-48 h-48 rounded-3xl items-center justify-center"
              onPress={() => router.push("/(create)/camera")}
            >
              <Ionicons name="videocam" size={48} color="#FF6B00" />
              <Text intent="accent" className="mt-4">
                Record Video
              </Text>
            </Button>

            <Button
              variant="neu-pressed"
              className="w-48 h-48 rounded-3xl items-center justify-center"
              onPress={() => router.push("/(create)/library")}
            >
              <Ionicons name="images" size={48} color="#FF6B00" />
              <Text intent="accent" className="mt-2">
                Upload Video
              </Text>
            </Button>
          </View>
        </View>
      </AnimatedContainer>
    </View>
  );
}
