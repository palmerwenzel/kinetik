import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface PhotoStepProps {
  photoUri: string | null;
  isUploading: boolean;
  onPickImage: () => void;
  onUploadPhoto: () => void;
}

export function PhotoStep({ photoUri, isUploading, onPickImage, onUploadPhoto }: PhotoStepProps) {
  return (
    <View className="items-center">
      <View className="mb-6">
        {photoUri ? (
          <Image source={{ uri: photoUri }} className="w-32 h-32 rounded-full" resizeMode="cover" />
        ) : (
          <View className="w-32 h-32 rounded-full bg-neutral-200 items-center justify-center">
            <Text intent="muted">No photo</Text>
          </View>
        )}
      </View>

      <View className="w-full gap-y-4">
        <Button
          variant="neu-raised"
          textComponent={<Text intent="button-primary">Choose Photo</Text>}
          size="lg"
          onPress={onPickImage}
          isDisabled={isUploading}
          className="w-full"
        />

        {photoUri && (
          <Button
            variant="neu-accent"
            textComponent={<Text intent="button-accent">Continue</Text>}
            size="lg"
            onPress={onUploadPhoto}
            isLoading={isUploading}
            className="w-full"
          />
        )}
      </View>
    </View>
  );
}
