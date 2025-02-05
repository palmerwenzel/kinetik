import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { INTERESTS, type Interest } from "@/lib/constants/interests";

const MemoizedSelectionCount = React.memo(function SelectionCount({ count }: { count: number }) {
  return (
    <>
      <Text intent="muted" className="text-center mb-4">
        Choose up to 5 interests
      </Text>
      <Text intent="muted" size="sm" className="text-center mb-6">
        Selected: {count}/5
      </Text>
    </>
  );
});

const MemoizedCompleteButton = React.memo(function CompleteButton({
  onPress,
  isDisabled,
  isLoading,
}: {
  onPress: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
}) {
  return (
    <Button
      variant="neu-accent"
      textComponent={<Text intent="button-accent">Complete Profile</Text>}
      size="lg"
      onPress={onPress}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className="w-full mt-6"
    />
  );
});

// Move this outside to prevent recreation
const categorizeInterests = (interests: Interest[]) => {
  return interests.reduce<Record<string, Interest[]>>((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {});
};

interface InterestsStepProps {
  selectedInterests: string[];
  onToggleInterest: (interestId: string) => void;
  onComplete: () => void;
  isLoading?: boolean;
}

export function InterestsStep({
  selectedInterests,
  onToggleInterest,
  onComplete,
  isLoading = false,
}: InterestsStepProps) {
  // Memoize the categorized interests
  const interestsByCategory = useMemo(() => categorizeInterests(INTERESTS), []);

  return (
    <View className="w-full">
      <MemoizedSelectionCount count={selectedInterests.length} />

      {Object.entries(interestsByCategory).map(([category, interests]) => (
        <View key={category} className="mb-6">
          <Text weight="semibold" className="capitalize mb-3">
            {category}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {interests.map(interest => (
              <Tag
                key={interest.id}
                label={interest.label}
                isSelected={selectedInterests.includes(interest.id)}
                onPress={() => onToggleInterest(interest.id)}
                isDisabled={
                  isLoading ||
                  (selectedInterests.length >= 5 && !selectedInterests.includes(interest.id))
                }
              />
            ))}
          </View>
        </View>
      ))}

      <MemoizedCompleteButton
        onPress={onComplete}
        isDisabled={selectedInterests.length === 0}
        isLoading={isLoading}
      />
    </View>
  );
}
