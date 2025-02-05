/**
 * Re-export the base Text component with any app-specific customizations
 */
import { Text as RNText } from "react-native";
import type { TextProps as RNTextProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const textVariants = cva(
  // Base styles - default text color with dark mode support
  "text-text dark:text-text-dark",
  {
    variants: {
      intent: {
        // Main content text
        body: "text-text dark:text-text-dark",
        // Less prominent text
        muted: "text-text-secondary dark:text-text-dark-secondary",
        // Even less prominent text
        subtle: "text-text-tertiary dark:text-text-dark-tertiary",
        // Accent colored text
        accent: "text-text-primary dark:text-text-primary-light text-center",
        // On Surface text
        onSurface: "text-white dark:text-text-dark-secondary text-center",
        // Error messages
        error: "text-error",
        // Button text variants - matching signup page styling
        "button-primary":
          "text-text-primary dark:text-text-primary-light text-center font-semibold text-lg",
        "button-accent": "text-white text-center font-semibold text-lg",
        "button-neutral": "text-text dark:text-text-dark text-center font-semibold text-lg",
        "button-link": "text-text-primary dark:text-text-primary-light font-semibold",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      intent: "body",
    },
  }
);

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  children?: React.ReactNode;
}

export function Text({
  intent,
  size,
  weight,
  align,
  className = "",
  children,
  ...props
}: TextProps) {
  // Only include variants that are explicitly provided
  const variants = {
    intent,
    ...(size && { size }),
    ...(weight && { weight }),
    ...(align && { align }),
  };

  return (
    <RNText className={`${textVariants(variants)} ${className}`} {...props}>
      {children}
    </RNText>
  );
}
