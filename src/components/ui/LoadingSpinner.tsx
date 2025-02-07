import React from "react";
import { ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({ size = "large", color = "#FF6B00" }: LoadingSpinnerProps) {
  return <ActivityIndicator size={size} color={color} />;
}
