import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { Tag } from "@/components/ui/Tag";
import { useCreateGroupFormContext } from "./_layout";
import { INTERESTS } from "@/lib/constants/interests";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";
import { Input } from "@/components/ui/Input";
import { SuccessOverlay } from "@/components/ui/SuccessOverlay";
import { useState, useEffect } from "react";
import { FirebaseError } from "firebase/app";

export default function ReviewStep() {
  const { form, isSubmitting } = useCreateGroupFormContext();
  const {
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = form;
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const values = getValues();

  // Watch for submission success/failure
  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsSuccess(true);
    }
  }, [isSubmitSuccessful]);

  // Handle form errors
  useEffect(() => {
    if (errors.root?.serverError) {
      const error = errors.root.serverError;
      if (error instanceof FirebaseError) {
        setError(`Failed to create group: ${error.message}`);
      } else {
        setError("Failed to create group. Please try again.");
      }
    }
  }, [errors.root?.serverError]);

  // Get category label from ID
  const categoryLabel = INTERESTS.find(interest => interest.id === values.category)?.label;

  // Get visibility label
  const visibilityLabel = {
    public: "Public",
    private: "Private",
  }[values.visibility];

  // Get membership label
  const membershipLabel = {
    open: "Open",
    "invite-only": "Invite Only",
    closed: "Closed",
  }[values.membership];

  if (isSuccess) {
    return <SuccessOverlay message="Group created successfully!" onConfirm={() => {}} />;
  }

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
        className="flex-1 items-center px-8 py-12"
      >
        {error && (
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("immediate")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-8 w-full"
          >
            <Text intent="error" className="text-center mb-4">
              {error}
            </Text>
          </AnimatedContainer>
        )}

        <View className="w-full">
          {/* Basic Info */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("immediate")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-8"
          >
            <View className="my-2">
              <Input
                variant="neu-surface"
                label="Group Name"
                value={values.name}
                editable={false}
              />
            </View>
            <View className="my-2">
              <Input
                variant="neu-surface"
                label="Description"
                value={values.description}
                multiline
                numberOfLines={4}
                editable={false}
              />
            </View>
            <View className="my-2">
              <Input
                variant="neu-surface"
                label="Category"
                value={categoryLabel}
                editable={false}
              />
            </View>
          </AnimatedContainer>

          {/* Visibility */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("header")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
            className="mb-8"
          >
            <View className="flex items-center justify-center gap-4">
              <View className="flex items-center justify-center gap-2">
                <Text weight="medium">Visibility:</Text>
                <Tag label={visibilityLabel} isSelected isDisabled />
              </View>
              <View className="flex items-center justify-center gap-2">
                <Text weight="medium">Membership:</Text>
                <Tag label={membershipLabel} isSelected isDisabled />
              </View>
            </View>
          </AnimatedContainer>

          {/* Posting Goals */}
          <AnimatedContainer
            variant="transparent"
            padding="none"
            delay={getAnimationDelay("actions")}
            duration={ANIMATION_PRESETS.content.duration}
            initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          >
            <View className="flex items-center justify-center gap-2">
              <Text weight="medium">Posting Goal:</Text>
              <View className="flex-row items-center justify-center gap-2">
                <Tag
                  label={`${values.postingGoal.count} post${values.postingGoal.count !== 1 ? "s" : ""}`}
                  isSelected
                  isDisabled
                />
                <Text>per</Text>
                <Tag label={values.postingGoal.frequency} isSelected isDisabled />
                <Text>per</Text>
                <Tag
                  label={values.postingGoal.scope === "person" ? "person" : "group"}
                  isSelected
                  isDisabled
                />
              </View>
            </View>
          </AnimatedContainer>
        </View>
      </AnimatedContainer>
    </ScrollView>
  );
}
