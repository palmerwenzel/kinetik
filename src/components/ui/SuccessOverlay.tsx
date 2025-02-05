import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "./Text";
import { Button } from "./Button";
import { AnimatedContainer } from "./AnimatedContainer";

interface SuccessOverlayProps {
  message: string;
  onConfirm: () => void;
}

export function SuccessOverlay({ message, onConfirm }: SuccessOverlayProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <View className="absolute inset-0 bg-black/20 dark:bg-black/40 items-center justify-center px-8">
        <AnimatedContainer
          variant="neu-surface"
          padding="lg"
          className="w-full max-w-sm"
          duration={300}
          initialOffsetY={20}
        >
          <Text intent="accent" size="xl" weight="semibold" className="text-center mb-6">
            {message}
          </Text>

          <Button
            variant="neu-accent"
            size="lg"
            onPress={onConfirm}
            textComponent={<Text intent="button-accent">Let&apos;s Go</Text>}
          />
        </AnimatedContainer>
      </View>
    </KeyboardAvoidingView>
  );
}
