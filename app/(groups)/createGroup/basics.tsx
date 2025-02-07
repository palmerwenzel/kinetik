import { View, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INTERESTS } from "@/lib/constants/interests";
import { useCreateGroupFormContext } from "./_layout";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";

export default function BasicsStep() {
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
          {/* Group Name */}
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
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="neu-surface"
                  label="Group Name"
                  placeholder="Enter group name"
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />
          </AnimatedContainer>

          {/* Description */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("header")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-6"
          >
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="neu-surface"
                  label="Description"
                  placeholder="What's this group about?"
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  error={errors.description?.message}
                />
              )}
            />
          </AnimatedContainer>

          {/* Category */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("actions")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          >
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Select
                  variant="neu-surface"
                  label="Category"
                  placeholder="Select a category"
                  options={INTERESTS.map(interest => ({
                    label: interest.label,
                    value: interest.id,
                  }))}
                  value={value}
                  onChange={onChange}
                  error={errors.category?.message}
                  searchable
                />
              )}
            />
          </AnimatedContainer>
        </View>
      </AnimatedContainer>
    </ScrollView>
  );
}
