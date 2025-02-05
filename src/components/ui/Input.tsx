import { TextInput, View, StyleProp, TextStyle } from "react-native";
import { useColorScheme } from "nativewind";
import type { TextInputProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Text } from "./Text";
import type { TextProps } from "./Text";
import React from "react";

const inputContainerVariants = cva(
  // Base styles - match signup.tsx exactly
  "p-4 rounded-xl shadow-sm border-2",
  {
    variants: {
      variant: {
        // Neumorphic Variants
        "neu-surface": [
          "bg-white dark:bg-[#2A2A2A]",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-white",
        ],
        "neu-inset": [
          "bg-white dark:bg-[#2A2A2A]",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-white",
          "shadow-neu-pressed dark:shadow-neu-pressed-dark",
        ],
        // Flat Variants
        "flat-surface": [
          "bg-white dark:bg-[#2A2A2A]",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-white",
        ],
        "flat-minimal": [
          "border-b-2 rounded-none",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-white",
        ],
        // Special States
        error: ["bg-white dark:bg-[#2A2A2A]", "border-error", "text-gray-900 dark:text-white"],
      },
      isDisabled: {
        true: "opacity-50",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      variant: "neu-surface",
      isDisabled: false,
    },
  }
);

export interface InputProps
  extends Omit<TextInputProps, "placeholderTextColor" | "style">,
    VariantProps<typeof inputContainerVariants> {
  label?: string | React.ReactNode;
  error?: string | React.ReactNode;
  helperText?: string | React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function Input({
  variant = "neu-surface",
  isDisabled,
  label,
  error,
  helperText,
  className = "",
  style,
  ...props
}: InputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const placeholderColor = isDark ? "#666" : "#999";
  const finalVariant = error ? "error" : variant;

  // Shadow styles based on theme
  const shadowStyle: StyleProp<TextStyle> = {
    shadowColor: isDark ? "rgb(0, 0, 0)" : "rgb(166, 166, 166)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  };

  // Render text content with proper handling
  const renderText = (content: string | React.ReactNode, defaultProps: Partial<TextProps>) => {
    if (!content) return null;

    // If content is already a Text component or other ReactNode, return as is
    if (React.isValidElement(content)) return content;

    // If content is a string, wrap it in our Text component
    if (typeof content === "string") {
      return <Text {...defaultProps}>{content}</Text>;
    }

    return null;
  };

  return (
    <View className="w-full">
      {renderText(label, {
        className: `text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`,
      })}
      <TextInput
        className={`${inputContainerVariants({ variant: finalVariant, isDisabled })} ${className}`}
        style={[shadowStyle, style]}
        placeholderTextColor={placeholderColor}
        editable={!isDisabled}
        {...props}
      />
      {renderText(error || helperText, {
        className: `text-sm mt-2 ${error ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600"}`,
      })}
    </View>
  );
}
