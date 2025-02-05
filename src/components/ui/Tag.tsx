import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const tagVariants = cva(
  // Base styles - always include border with consistent width
  "rounded-full px-4 py-2 flex-row items-center justify-center border border-transparent",
  {
    variants: {
      variant: {
        "neu-raised": [
          "bg-surface dark:bg-surface-dark",
          "shadow-[2px_2px_4px_rgba(166,166,166,0.2)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2)]",
          "border-border/20 dark:border-border-dark/20",
        ],
        "neu-pressed": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-pressed dark:shadow-neu-pressed-dark",
          "border-border/20 dark:border-border-dark/20",
        ],
      },
      isSelected: {
        true: [
          "bg-primary border-primary-light/20 dark:border-primary-dark/20",
          "shadow-[2px_2px_4px_rgba(0,0,0,0.3)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.4)]",
        ],
        false: "", // Unselected state uses variant styles
      },
    },
    defaultVariants: {
      variant: "neu-raised",
      isSelected: false,
    },
  }
);

export interface TagProps extends VariantProps<typeof tagVariants> {
  label: string;
  onPress?: () => void;
  isDisabled?: boolean;
}

export function Tag({ label, variant, isSelected, onPress, isDisabled }: TagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${tagVariants({ variant, isSelected })} ${isDisabled ? "opacity-50" : ""}`}
    >
      <Text
        intent={isSelected ? "accent" : "body"}
        size="base"
        weight="medium"
        className="text-center"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
