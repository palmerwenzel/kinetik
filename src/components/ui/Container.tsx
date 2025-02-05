import { View } from "react-native";
import type { ViewProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const containerVariants = cva(
  // Base styles - consistent rounding
  "rounded-neu",
  {
    variants: {
      variant: {
        // Neumorphic Variants
        "neu-surface": ["bg-surface dark:bg-surface-dark", "shadow-neu-sm dark:shadow-neu-sm-dark"],
        "neu-elevated": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-md dark:shadow-neu-md-dark",
        ],
        "neu-inset": [
          "bg-surface dark:bg-surface-dark",
          "shadow-neu-pressed dark:shadow-neu-pressed-dark",
        ],
        // Flat Variants
        "flat-surface": ["bg-surface dark:bg-surface-dark"],
        "flat-bordered": [
          "bg-surface dark:bg-surface-dark",
          "border border-border dark:border-border-dark",
        ],
        "flat-accent": [
          "bg-primary/10 dark:bg-primary/20",
          "border border-primary/20 dark:border-primary/30",
        ],
        // Special Variants
        transparent: "bg-transparent",
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "neu-surface",
      padding: "md",
    },
  }
);

export interface ContainerProps extends ViewProps, VariantProps<typeof containerVariants> {
  children?: React.ReactNode;
}

export function Container({
  variant,
  padding,
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <View className={`${containerVariants({ variant, padding })} ${className}`} {...props}>
      {children}
    </View>
  );
}
