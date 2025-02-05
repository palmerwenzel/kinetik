import { View } from "react-native";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const spacerVariants = cva("", {
  variants: {
    size: {
      xs: "h-2",
      sm: "h-4",
      md: "h-6",
      lg: "h-8",
      xl: "h-12",
    },
    direction: {
      vertical: "",
      horizontal: "w-[1px] h-full",
    },
  },
  defaultVariants: {
    size: "md",
    direction: "vertical",
  },
});

interface SpacerProps extends VariantProps<typeof spacerVariants> {
  className?: string;
}

export function Spacer({ size, direction, className = "" }: SpacerProps) {
  return <View className={`${spacerVariants({ size, direction })} ${className}`} />;
}
