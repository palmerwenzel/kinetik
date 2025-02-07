import React from "react";
import { View, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { Text } from "@/components/ui/Text";
import { Tag } from "@/components/ui/Tag";
import { useCreateGroupFormContext } from "./_layout";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";
import { VISIBILITY_OPTIONS, MEMBERSHIP_OPTIONS } from "@/lib/constants/groups";

export default function VisibilityStep() {
  const { form } = useCreateGroupFormContext();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-surface dark:bg-surface-dark"
    >
      <AnimatedContainer
        variant="transparent"
        padding="none"
        delay={getAnimationDelay("content")}
        duration={ANIMATION_PRESETS.content.duration}
        initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
        className="flex-1 items-center pt-4"
      >
        <View className="w-3/4">
          {/* Membership Options */}
          <View>
            <Text weight="medium" size="lg" className="text-center mb-2">
              How can people join?
            </Text>
            <View className="space-y-4">
              {MEMBERSHIP_OPTIONS.map(option => (
                <Controller
                  key={option.value}
                  control={control}
                  name="membership"
                  render={({ field: { onChange, value } }) => (
                    <View className="w-full my-2">
                      <Tag
                        label={option.label}
                        isSelected={value === option.value}
                        onPress={() => onChange(option.value)}
                      />
                      <Text size="xs" intent="muted" className="mt-2 text-center">
                        {option.description}
                      </Text>
                    </View>
                  )}
                />
              ))}
            </View>
            {errors.membership && (
              <Text intent="error" size="xs" className="mt-4 text-center">
                {errors.membership.message}
              </Text>
            )}
          </View>
          {/* Visibility Options */}
          <View className="mb-8">
            <Text weight="medium" size="lg" className="text-center mt-8 mb-2">
              Who can see this group?
            </Text>
            <View className="space-y-4">
              {VISIBILITY_OPTIONS.map(option => (
                <Controller
                  key={option.value}
                  control={control}
                  name="visibility"
                  render={({ field: { onChange, value } }) => (
                    <View className="w-full my-2">
                      <Tag
                        label={option.label}
                        isSelected={value === option.value}
                        onPress={() => onChange(option.value)}
                      />
                      <Text size="xs" intent="muted" className="mt-2 text-center">
                        {option.description}
                      </Text>
                    </View>
                  )}
                />
              ))}
            </View>
            {errors.visibility && (
              <Text intent="error" size="xs" className="mt-4 text-center">
                {errors.visibility.message}
              </Text>
            )}
          </View>
        </View>
      </AnimatedContainer>
    </ScrollView>
  );
}
