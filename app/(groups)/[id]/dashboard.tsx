import React, { useState, useEffect } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useGroup } from "@/hooks/useGroup";
import { GroupSettings } from "@/components/groups/GroupSettings";
import { InviteManagement } from "@/components/groups/InviteManagement";
import { RequestManagement } from "@/components/groups/RequestManagement";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type DashboardTab = "invites" | "requests" | "settings";

const TABS: { label: string; value: DashboardTab }[] = [
  { label: "Settings", value: "settings" },
  { label: "Invites", value: "invites" },
  { label: "Requests", value: "requests" },
];

export default function GroupDashboardScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const { group, members = [], isAdmin = false } = useGroup(groupId);
  const [activeTab, setActiveTab] = useState<DashboardTab>("settings");
  const router = useRouter();

  return (
    <AnimatedContainer variant="flat-surface" className="flex-1">
      <SafeAreaView edges={["top"]} className="bg-surface dark:bg-surface-dark">
        {/* Header */}
        <View className="px-4 py-3 border-b border-border/20 dark:border-border-dark/20">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -m-2">
              <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            <Text weight="bold" size="xl" className="flex-1 text-center">
              Settings
            </Text>
            <View style={{ width: 40 }} />
            {/*Spacer to balance the back button*/}
          </View>

          {/* Tab Navigation */}
          <View className="flex-row justify-between mt-2">
            {TABS.map(tab => (
              <Pressable key={tab.value} onPress={() => setActiveTab(tab.value)} className="flex-1">
                <View className="items-center">
                  <Text
                    weight={activeTab === tab.value ? "bold" : "normal"}
                    className={`${
                      activeTab === tab.value
                        ? "text-primary"
                        : "text-text/60 dark:text-text-dark/60"
                    }`}
                  >
                    {tab.label}
                  </Text>
                  {/* Indicator line */}
                  <View
                    className={`h-0.5 w-12 mt-2 rounded-full ${
                      activeTab === tab.value ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <View className="flex-1 p-4">
        {activeTab === "invites" && <InviteManagement groupId={groupId} isAdmin={isAdmin} />}
        {activeTab === "requests" && <RequestManagement groupId={groupId} isAdmin={isAdmin} />}
        {activeTab === "settings" && (
          <GroupSettings group={group} members={members} isAdmin={isAdmin} />
        )}
      </View>

      <SafeAreaView edges={["bottom"]} className="bg-surface dark:bg-surface-dark" />
    </AnimatedContainer>
  );
}
