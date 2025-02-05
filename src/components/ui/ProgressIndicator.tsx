import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const progressIndicatorVariants = cva(
  // Base styles
  "flex-row items-center justify-between w-full mb-6",
  {
    variants: {
      size: {
        sm: "max-w-[240px]",
        md: "max-w-[320px]",
        lg: "max-w-[400px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const stepVariants = cva(
  // Base styles for step indicators
  "rounded-full items-center justify-center border-2",
  {
    variants: {
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
      state: {
        completed: ["bg-primary border-primary dark:border-primary-dark"],
        current: ["bg-surface dark:bg-surface-dark", "border-primary"],
        upcoming: ["bg-surface dark:bg-surface-dark", "border-border dark:border-border-dark"],
      },
    },
    defaultVariants: {
      size: "md",
      state: "upcoming",
    },
  }
);

const lineVariants = cva(
  // Base styles for connecting lines
  "flex-1 h-[2px] mx-2",
  {
    variants: {
      state: {
        completed: "bg-primary",
        upcoming: "bg-border dark:bg-border-dark",
      },
    },
    defaultVariants: {
      state: "upcoming",
    },
  }
);

export interface ProgressIndicatorProps extends VariantProps<typeof progressIndicatorVariants> {
  currentStep: number;
  steps: Array<{
    label: string;
    value: number;
  }>;
  className?: string;
  onStepPress?: (step: number) => void;
}

export function ProgressIndicator({
  size,
  currentStep,
  steps,
  className = "",
  onStepPress,
}: ProgressIndicatorProps) {
  const handleStepPress = (step: number) => {
    // Only allow navigation to completed steps or current step
    if (step <= currentStep && onStepPress) {
      onStepPress(step);
    }
  };

  return (
    <View className={`${progressIndicatorVariants({ size })} ${className}`}>
      {steps.map((step, index) => {
        const stepState =
          step.value < currentStep
            ? "completed"
            : step.value === currentStep
              ? "current"
              : "upcoming";
        const isClickable = step.value <= currentStep;

        return (
          <React.Fragment key={step.value}>
            {/* Step indicator */}
            <TouchableOpacity
              onPress={() => handleStepPress(step.value)}
              disabled={!isClickable}
              className={`${stepVariants({ size, state: stepState })} ${
                isClickable ? "active:opacity-80" : ""
              }`}
            >
              <Text
                intent={step.value < currentStep ? "onSurface" : "body"}
                size="base"
                weight="semibold"
              >
                {step.value}
              </Text>
            </TouchableOpacity>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <View
                className={lineVariants({
                  state: step.value < currentStep ? "completed" : "upcoming",
                })}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
