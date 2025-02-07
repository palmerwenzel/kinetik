import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, TextInput, StyleProp, ViewStyle } from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import type { TextProps } from "./Text";

const selectContainerVariants = cva(
  // Base styles - match Input.tsx exactly
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

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends VariantProps<typeof selectContainerVariants> {
  label?: string | React.ReactNode;
  placeholder?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string | React.ReactNode;
  multiple?: boolean;
  maxSelections?: number;
  searchable?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Select({
  variant = "neu-surface",
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  multiple = false,
  maxSelections = Infinity,
  searchable = false,
  isDisabled = false,
  style,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const selectedValues = Array.isArray(value) ? value : [value];
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Shadow styles based on theme
  const shadowStyle: StyleProp<ViewStyle> = {
    shadowColor: isDark ? "rgb(0, 0, 0)" : "rgb(166, 166, 166)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  };

  const handleSelect = (optionValue: string) => {
    if (isDisabled) return;

    if (multiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];

      // Check maxSelections only when adding
      if (!selectedValues.includes(optionValue) && newValue.length > maxSelections) {
        return;
      }

      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
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

  const finalVariant = error ? "error" : variant;

  return (
    <View className="w-full">
      {renderText(label, {
        className: `text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`,
      })}
      <View
        className={`${selectContainerVariants({ variant: finalVariant, isDisabled })} relative`}
        style={[shadowStyle, style]}
      >
        <TouchableOpacity
          onPress={() => !isDisabled && setIsOpen(!isOpen)}
          className="flex-row items-center justify-between"
          disabled={isDisabled}
        >
          <View className="flex-1">
            {selectedOptions.length > 0 ? (
              <Text>{selectedOptions.map(option => option.label).join(", ")}</Text>
            ) : (
              <Text intent="muted">{placeholder}</Text>
            )}
          </View>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={isDark ? "#666666" : "#999999"}
          />
        </TouchableOpacity>

        {isOpen && (
          <View className="absolute left-0 right-0 top-[calc(100%+1px)] bg-white dark:bg-[#2A2A2A] rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg z-50">
            {searchable && (
              <View className="p-2 border-b-2 border-gray-200 dark:border-gray-700">
                <TextInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  placeholderTextColor={isDark ? "#666666" : "#999999"}
                />
              </View>
            )}
            <ScrollView className="max-h-64">
              {filteredOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  className="p-4 flex-row items-center justify-between active:bg-gray-100 dark:active:bg-gray-800"
                >
                  <Text>{option.label}</Text>
                  {selectedValues.includes(option.value) && (
                    <Ionicons name="checkmark" size={20} color="#FF6B00" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {renderText(error, {
        className: `text-sm mt-2 ${error ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600"}`,
      })}
    </View>
  );
}
