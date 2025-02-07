import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Ionicons } from "@expo/vector-icons";
import type { DbGroup } from "@/types/firebase/firestoreTypes";

interface GroupListProps {
  groups: Array<DbGroup & { id: string }>;
}

export function GroupList({ groups }: GroupListProps) {
  const router = useRouter();

  return (
    <View className="space-y-4">
      {groups.map(group => (
        <Pressable key={group.id} onPress={() => router.push(`/(app)/groups/${group.id}`)}>
          <AnimatedContainer variant="neu-surface" className="flex-row items-center p-4">
            {/* Group Icon */}
            <View className="bg-accent/10 rounded-full p-2 mr-4">
              <Ionicons name="people" size={24} color="#FF6B00" />
            </View>

            {/* Group Info */}
            <View className="flex-1">
              <Text weight="medium" className="mb-1">
                {group.name}
              </Text>
              <Text size="sm" intent="muted" numberOfLines={1}>
                {group.description || "No description"}
              </Text>
            </View>

            {/* Role Badge */}
            <View className="ml-4">
              <View className="bg-accent/10 rounded-full px-3 py-1">
                <Text size="xs" className="text-orange-500">
                  {group.memberRoles[group.createdBy]}
                </Text>
              </View>
            </View>

            {/* Arrow */}
            <Ionicons name="chevron-forward" size={20} color="#666666" style={{ marginLeft: 8 }} />
          </AnimatedContainer>
        </Pressable>
      ))}
    </View>
  );
}
