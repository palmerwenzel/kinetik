import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleProp,
  ViewStyle,
  Modal,
  Pressable,
  findNodeHandle,
} from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { cva } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import type { TextProps } from "./Text";

const selectContainerVariants = cva("p-4 rounded-xl shadow-sm border-2", {
  variants: {
    variant: {
      "neu-surface": [
        "bg-white dark:bg-[#2A2A2A]",
        "border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-white",
      ],
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
});

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface ControlledSelectProps {
  label?: string | React.ReactNode;
  placeholder?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string | React.ReactNode;
  maxSelections?: number;
  searchable?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  zIndex?: number;
}

export function ControlledSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  maxSelections = Infinity,
  searchable = false,
  isDisabled = false,
  style,
  isOpen,
  onOpenChange,
  zIndex = 1,
}: ControlledSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, maxHeight: 300 });
  const triggerRef = useRef<View>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const selectedOptions = options.filter(option => value.includes(option.value));
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (isDisabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];

    if (!value.includes(optionValue) && newValue.length > maxSelections) {
      return;
    }

    onChange(newValue);
  };

  const renderText = (content: string | React.ReactNode, defaultProps: Partial<TextProps>) => {
    if (!content) return null;
    if (React.isValidElement(content)) return content;
    if (typeof content === "string") {
      return <Text {...defaultProps}>{content}</Text>;
    }
    return null;
  };

  const finalVariant = error ? "error" : "neu-surface";

  const measureTrigger = () => {
    if (triggerRef.current) {
      const node = findNodeHandle(triggerRef.current);
      if (node) {
        triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
          // Calculate the available space below the trigger
          const windowHeight = global.window?.innerHeight || 800;
          const spaceBelow = windowHeight - (pageY + height);
          const maxHeight = Math.min(300, spaceBelow - 20); // 20px padding

          setDropdownPosition({
            top: pageY + height + 4, // 4px gap
            maxHeight,
          });
        });
      }
    }
  };

  const handleOpen = () => {
    if (!isDisabled) {
      measureTrigger();
      onOpenChange(true);
    }
  };

  return (
    <View className="w-full" style={{ zIndex }}>
      {renderText(label, {
        className: `text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`,
      })}

      <View
        ref={triggerRef}
        className={selectContainerVariants({ variant: finalVariant, isDisabled })}
        style={style}
      >
        <TouchableOpacity
          onPress={handleOpen}
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
      </View>

      <Modal visible={isOpen} transparent animationType="none">
        <Pressable className="flex-1" onPress={() => onOpenChange(false)}>
          <View
            className="absolute left-4 right-4 bg-white dark:bg-[#2A2A2A] rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
            style={{
              top: dropdownPosition.top,
            }}
          >
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
            <ScrollView style={{ maxHeight: dropdownPosition.maxHeight }}>
              {filteredOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={e => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  className="p-4 flex-row items-center justify-between active:bg-gray-100 dark:active:bg-gray-800"
                >
                  <View className="flex-1">
                    <Text>{option.label}</Text>
                    {option.description && (
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </Text>
                    )}
                  </View>
                  {value.includes(option.value) && (
                    <Ionicons name="checkmark" size={20} color="#FF6B00" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {renderText(error, {
        className: `text-sm mt-2 ${error ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600"}`,
      })}
    </View>
  );
}
