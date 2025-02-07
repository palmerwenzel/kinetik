import React from "react";
import { View } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Controller } from "react-hook-form";

interface NameFormData {
  firstName: string;
  lastName: string;
  username: string;
}

interface NameStepProps {
  control: Control<NameFormData>;
  errors: FieldErrors<NameFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  isCheckingUsername: boolean;
}

export function NameStep({
  control,
  errors,
  isSubmitting,
  onSubmit,
  isCheckingUsername,
}: NameStepProps) {
  return (
    <>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input
              variant="neu-surface"
              label="First Name"
              placeholder="Enter your first name"
              autoCapitalize="words"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              isDisabled={isSubmitting}
              error={errors.firstName?.message}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input
              variant="neu-surface"
              label="Last Name"
              placeholder="Enter your last name"
              autoCapitalize="words"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              isDisabled={isSubmitting}
              error={errors.lastName?.message}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input
              variant="neu-surface"
              label="Username"
              placeholder="Choose a unique username"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              isDisabled={isSubmitting || isCheckingUsername}
              error={errors.username?.message}
              helperText="Letters, numbers, and underscores only"
            />
          </View>
        )}
      />

      <Button
        variant="neu-accent"
        textComponent={<Text intent="button-accent">Continue</Text>}
        size="lg"
        isLoading={isSubmitting || isCheckingUsername}
        onPress={onSubmit}
        className="w-full mb-4"
      />
    </>
  );
}
