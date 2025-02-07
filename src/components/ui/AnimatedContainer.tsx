import React, { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useColorScheme } from "nativewind";

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

export interface AnimatedContainerProps extends ViewProps, VariantProps<typeof containerVariants> {
  children?: React.ReactNode;
  delay?: number;
  duration?: number;
  initialOffsetY?: number;
}

export function AnimatedContainer({
  variant,
  padding,
  className = "",
  children,
  delay = 0,
  duration = 600,
  initialOffsetY = 50,
  style,
  ...props
}: AnimatedContainerProps) {
  const translateY = useRef(new Animated.Value(initialOffsetY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Sequence of animations
    Animated.parallel([
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 0.8, // Slightly faster than the rise
        delay,
        useNativeDriver: true,
      }),
      // Rise up
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, duration, delay]);

  return (
    <Animated.View
      className={`${containerVariants({ variant, padding })} ${className}`}
      style={[
        {
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
