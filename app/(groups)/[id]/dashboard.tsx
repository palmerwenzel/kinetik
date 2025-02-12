import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Tag } from "@/components/ui/Tag";
import { useGroup } from "@/hooks/useGroup";

type DashboardTab = "invites" | "applications" | "settings";

const TABS: { label: string; value: DashboardTab }[] = [
  { label: "Invites", value: "invites" },
  { label: "Applications", value: "applications" },
  { label: "Settings", value: "settings" },
];

export default function GroupDashboardScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const router = useRouter();
  const { group, isAdmin = false } = useGroup(groupId);
  const [activeTab, setActiveTab] = useState<DashboardTab>("invites");

  // Redirect non-admins
  if (!isAdmin) {
    router.replace(`/(groups)/${groupId}`);
    return null;
  }

  return (
    <AnimatedContainer variant="flat-surface" className="flex-1">
      {/* Header */}
      <View className="px-4 py-3 border-b border-border/20 dark:border-border-dark/20">
        <Text weight="bold" size="xl" className="text-center">
          Dashboard
        </Text>
      </View>

      {/* Tabs */}
      <View className="px-4 py-2 border-b border-border/20 dark:border-border-dark/20">
        <View className="flex-row justify-between">
          {TABS.map(tab => (
            <View key={tab.value} className="flex-1 px-1">
              <Tag
                label={tab.label}
                isSelected={activeTab === tab.value}
                onPress={() => setActiveTab(tab.value)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-4">
        {activeTab === "invites" && <Text>Invites management coming soon</Text>}
        {activeTab === "applications" && <Text>Applications management coming soon</Text>}
        {activeTab === "settings" && <Text>Settings management coming soon</Text>}
      </View>
    </AnimatedContainer>
  );
}
