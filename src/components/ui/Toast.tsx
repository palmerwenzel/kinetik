/**
 * Toast notification component for displaying success, error, and info messages
 */
import React from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
  style?: Animated.WithAnimatedValue<any>;
}

const toastConfig = {
  success: {
    icon: "checkmark-circle",
    color: "#22C55E",
    bgColor: "bg-green-500",
  },
  error: {
    icon: "alert-circle",
    color: "#EF4444",
    bgColor: "bg-red-500",
  },
  info: {
    icon: "information-circle",
    color: "#3B82F6",
    bgColor: "bg-blue-500",
  },
};

export function Toast({ message, type, onDismiss, style }: ToastProps) {
  const config = toastConfig[type];

  return (
    <Animated.View style={style}>
      <View className={`mx-4 p-4 rounded-lg flex-row items-center ${config.bgColor} bg-opacity-90`}>
        <Ionicons name={config.icon as any} size={24} color="white" />
        <Text className="flex-1 ml-3 text-white">{message}</Text>
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
