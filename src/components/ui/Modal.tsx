import React from "react";
import { Modal as RNModal, TouchableOpacity, View, useColorScheme } from "react-native";
import { AnimatedContainer } from "./AnimatedContainer";
import { cn } from "@/lib/utils";

type ModalVariant =
  | "neu-surface"
  | "neu-elevated"
  | "neu-inset"
  | "flat-surface"
  | "flat-bordered"
  | "flat-accent"
  | "transparent";
type ModalPadding = "none" | "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: ModalVariant;
  padding?: ModalPadding;
}

export function Modal({
  isVisible,
  onClose,
  children,
  variant = "neu-surface",
  padding = "md",
}: ModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <RNModal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className={cn("flex-1 px-4", isDark ? "bg-black/70" : "bg-black/50")}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1 items-center justify-center"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <AnimatedContainer
              variant={variant}
              padding={padding}
              className={cn(
                "rounded-2xl overflow-hidden",
                isDark ? "shadow-lg shadow-black/50" : "shadow-xl shadow-black/20"
              )}
            >
              {children}
            </AnimatedContainer>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}
