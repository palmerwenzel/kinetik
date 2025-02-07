import React from "react";
import { View, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { useCreateGroupFormContext } from "./_layout";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";

const FREQUENCY_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
] as const;

const SCOPE_OPTIONS = [
  { label: "Per Person", value: "person", description: "Each member contributes this many posts" },
  {
    label: "Group Total",
    value: "group",
    description: "The group collectively makes this many posts",
  },
] as const;

interface PostingSummaryProps {
  goal: {
    count: number | undefined;
    frequency: string;
    scope: string;
  };
}

function PostingSummary({ goal }: PostingSummaryProps) {
  const { count, frequency, scope } = goal;

  // If count is undefined or NaN, show placeholder text
  const countDisplay =
    !count || isNaN(count) ? (
      <Text className="text-orange-500">some</Text>
    ) : (
      <>
        <Text className="text-orange-500">{count}</Text>
        <Text> {count === 1 ? "post" : "posts"}</Text>
      </>
    );

  return (
    <View className="p-4 bg-accent/5 rounded-xl">
      <Text weight="medium" size="sm" className="text-center mb-2">
        This group will aim for...
      </Text>
      <Text weight="bold" className="text-center">
        {countDisplay}
        <Text> per </Text>
        <Text className="text-orange-500">{frequency}</Text>
        <Text> {scope === "person" ? "per" : "as a"} </Text>
        <Text className="text-orange-500">{scope}</Text>
      </Text>
    </View>
  );
}

export default function PostingStep() {
  const { form } = useCreateGroupFormContext();
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const postingGoal = watch("postingGoal");

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-surface dark:bg-surface-dark"
    >
      {/* Summary */}
      <AnimatedContainer
        variant="transparent"
        padding="none"
        delay={getAnimationDelay("actions")}
        duration={ANIMATION_PRESETS.content.duration}
        initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
      >
        <PostingSummary goal={postingGoal} />
      </AnimatedContainer>
      <AnimatedContainer
        variant="transparent"
        padding="none"
        delay={getAnimationDelay("content")}
        duration={ANIMATION_PRESETS.content.duration}
        initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
        className="flex-1 items-center pt-8"
      >
        <View className="w-3/4">
          {/* Post Count */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("immediate")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-6"
          >
            <Controller
              control={control}
              name="postingGoal.count"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="neu-surface"
                  label="How many posts?"
                  placeholder="Enter number of posts"
                  keyboardType="number-pad"
                  defaultValue="1"
                  onChangeText={val => {
                    const num = val === "" ? undefined : parseInt(val, 10);
                    onChange(!num || isNaN(num) ? undefined : num);
                  }}
                  value={value?.toString() || ""}
                  error={errors.postingGoal?.count?.message}
                />
              )}
            />
          </AnimatedContainer>

          {/* Frequency */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("header")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-8"
          >
            <Text weight="medium" size="sm" className="mb-4 text-center">
              How often?
            </Text>
            <View className="flex-row justify-center gap-4">
              {FREQUENCY_OPTIONS.map(option => (
                <Controller
                  key={option.value}
                  control={control}
                  name="postingGoal.frequency"
                  render={({ field: { onChange, value } }) => (
                    <Tag
                      label={option.label}
                      isSelected={value === option.value}
                      onPress={() => onChange(option.value)}
                    />
                  )}
                />
              ))}
            </View>
            {errors.postingGoal?.frequency?.message && (
              <Text intent="error" size="xs" className="mt-2 text-center">
                {errors.postingGoal.frequency.message}
              </Text>
            )}
          </AnimatedContainer>

          {/* Scope */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("actions")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          >
            <Text weight="medium" size="sm" className="mb-2 text-center">
              How are posts counted?
            </Text>
            <View className="space-y-4">
              {SCOPE_OPTIONS.map(option => (
                <Controller
                  key={option.value}
                  control={control}
                  name="postingGoal.scope"
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
            {errors.postingGoal?.scope?.message && (
              <Text intent="error" size="xs" className="mt-2 text-center">
                {errors.postingGoal.scope.message}
              </Text>
            )}
          </AnimatedContainer>
        </View>
      </AnimatedContainer>
    </ScrollView>
  );
}
