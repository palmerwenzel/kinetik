import { View, TouchableOpacity } from "react-native";
import type { ViewProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Text } from "./Text";
import React from "react";

const cardVariants = cva(
  // Base styles - consistent rounding
  "rounded-neu overflow-hidden",
  {
    variants: {
      variant: {
        // Neumorphic Variants
        "neu-surface": ["bg-surface dark:bg-surface-dark", "shadow-neu-sm dark:shadow-neu-sm-dark"],
        "neu-elevated": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-md dark:shadow-neu-md-dark",
        ],
        "neu-interactive": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-md dark:shadow-neu-md-dark",
          "active:shadow-neu-pressed dark:active:shadow-neu-pressed-dark",
        ],
        // Flat Variants
        "flat-surface": [
          "bg-surface dark:bg-surface-dark",
          "border border-border dark:border-border-dark",
        ],
        "flat-accent": [
          "bg-primary/10 dark:bg-primary/20",
          "border border-primary/20 dark:border-primary/30",
        ],
        "flat-interactive": [
          "bg-surface dark:bg-surface-dark",
          "border border-border dark:border-border-dark",
          "active:opacity-90",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "neu-surface",
      padding: "md",
    },
  }
);

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  onPress?: () => void;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

export function Card({
  variant,
  padding,
  className = "",
  children,
  onPress,
  title,
  subtitle,
  ...props
}: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const finalVariant = onPress
    ? variant?.includes("interactive")
      ? variant
      : variant?.startsWith("neu")
        ? "neu-interactive"
        : "flat-interactive"
    : variant;

  // Render title/subtitle with proper text handling
  const renderHeader = () => {
    if (!title && !subtitle) return null;

    return (
      <View className="mb-3">
        {title &&
          (typeof title === "string" ? (
            <Text size="lg" weight="semibold">
              {title}
            </Text>
          ) : (
            title
          ))}
        {subtitle &&
          (typeof subtitle === "string" ? (
            <Text intent="muted" size="sm" className="mt-1">
              {subtitle}
            </Text>
          ) : (
            subtitle
          ))}
      </View>
    );
  };

  return (
    <Wrapper
      className={`${cardVariants({ variant: finalVariant, padding })} ${className}`}
      onPress={onPress}
      {...props}
    >
      {renderHeader()}
      {children}
    </Wrapper>
  );
}
