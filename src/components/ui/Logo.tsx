import React from "react";
import { Image, View, type ImageProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const logoVariants = cva("items-center justify-center", {
  variants: {
    size: {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-40 h-40",
    },
    variant: {
      "neu-raised": [
        "bg-surface dark:bg-surface-dark rounded-3xl p-4",
        "shadow-neu-md dark:shadow-neu-md-dark",
      ],
      "neu-inset": [
        "bg-surface dark:bg-surface-dark rounded-3xl p-4",
        "shadow-neu-pressed dark:shadow-neu-pressed-dark",
      ],
      flat: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "flat",
  },
});

export interface LogoProps extends Omit<ImageProps, "source">, VariantProps<typeof logoVariants> {
  className?: string;
}

export function Logo({ size, variant, className = "", style, ...props }: LogoProps) {
  const image = (
    <Image
      source={require("@/assets/images/kinetic-logo.png")}
      className="w-full h-full"
      resizeMode="contain"
      {...props}
    />
  );

  // If no variant is specified, return just the image
  if (!variant || variant === "flat") {
    return <View className={`${logoVariants({ size })} ${className}`}>{image}</View>;
  }

  // Return image with neumorphic container
  return <View className={`${logoVariants({ size, variant })} ${className}`}>{image}</View>;
}
