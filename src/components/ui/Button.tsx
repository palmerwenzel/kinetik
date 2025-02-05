import { TouchableOpacity, ActivityIndicator, View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import type { TouchableOpacityProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import React from "react";

const buttonVariants = cva(
  // Base styles - consistent rounding and padding
  "items-center justify-center p-4 rounded-xl",
  {
    variants: {
      variant: {
        // Neumorphic Variants with enhanced depth
        "neu-accent": [
          "bg-primary",
          "shadow-[4px_4px_5px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_5px_rgba(0,0,0,0.5)]",
          "active:shadow-neu-pressed active:shadow-neu-pressed-dark",
          "border-2 border-primary-light/20 dark:border-primary-dark/20",
        ],
        "neu-raised": [
          "bg-surface dark:bg-surface-dark",
          "shadow-[4px_4px_5px_rgba(166,166,166,0.3)] dark:shadow-[4px_4px_5px_rgba(0,0,0,0.3)]",
          "active:shadow-neu-pressed active:shadow-neu-pressed-dark",
          "border-2 border-border/20 dark:border-border-dark/20",
        ],
        "neu-pressed": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-pressed dark:shadow-neu-pressed-dark",
          "border-2 border-border/20 dark:border-border-dark/20",
        ],
        // Flat Variants with subtle depth
        "flat-accent": [
          "bg-primary",
          "shadow-[2px_2px_3px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_3px_rgba(0,0,0,0.4)]",
          "active:opacity-90",
          "border-2 border-primary-light/20 dark:border-primary-dark/20",
        ],
        "flat-surface": [
          "bg-surface dark:bg-surface-dark",
          "border-2 border-border dark:border-border-dark",
          "shadow-[2px_2px_3px_rgba(166,166,166,0.2)] dark:shadow-[2px_2px_3px_rgba(0,0,0,0.2)]",
          "active:opacity-90",
        ],
        "flat-transparent": ["bg-transparent", "active:opacity-90"],
        // Special Variants
        link: [
          "bg-transparent",
          "underline",
          "p-0", // Remove padding for inline use
        ],
        ghost: ["bg-transparent", "active:opacity-90"],
      },
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4",
      },
      isDisabled: {
        true: "opacity-50",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      variant: "neu-accent",
      size: "md",
      isDisabled: false,
    },
  }
);

export interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  isLoading?: boolean;
  textComponent?: React.ReactElement<typeof Text>;
}

export const Button = forwardRef<View, ButtonProps>(
  (
    { variant, size, isDisabled, isLoading, textComponent, className = "", children, ...props },
    ref
  ) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // Get default text styles based on button variant
    const getDefaultTextStyles = () => {
      if (variant?.includes("accent")) {
        return "text-white font-semibold text-lg text-center"; // Accent buttons
      }
      if (variant === "link") {
        return "text-primary dark:text-primary-light font-semibold"; // Links
      }
      return "text-text dark:text-text-dark font-semibold text-lg text-center"; // Default
    };

    // Render content based on props
    const renderContent = () => {
      if (isLoading) {
        return (
          <ActivityIndicator
            color={variant?.includes("accent") ? "#FFFFFF" : isDark ? "#FFFFFF" : "#666666"}
          />
        );
      }

      // If textComponent is provided, use it directly
      if (textComponent) {
        return textComponent;
      }

      // If children is a string, wrap it with default text styles
      if (typeof children === "string") {
        return <Text className={getDefaultTextStyles()}>{children}</Text>;
      }

      // If children is a Text component, let it keep its styles
      if (
        React.isValidElement(children) &&
        (children.type === Text ||
          (children.type as { displayName?: string })?.displayName === "Text")
      ) {
        return children;
      }

      // Otherwise, render children as is
      return children;
    };

    return (
      <TouchableOpacity
        ref={ref}
        className={`${buttonVariants({ variant, size, isDisabled })} ${className}`}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";
