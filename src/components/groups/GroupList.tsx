import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Ionicons } from "@expo/vector-icons";
import type { DbGroup } from "@/types/firebase/firestoreTypes";

// Sample groups to populate the list
const SAMPLE_GROUPS: Array<DbGroup & { id: string }> = [
  {
    id: "fitness-warriors",
    name: "Fitness Warriors",
    description: "Daily workout challenges, form checks, and lifting progress tracking",
    category: "fitness",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-1",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-1": "member",
    },
    memberCount: 156,
    postingGoal: {
      count: 1,
      frequency: "day",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "tech-innovators",
    name: "Tech Innovators",
    description: "Software engineers sharing coding tips, project updates, and tech discussions",
    category: "technology",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-2",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-2": "member",
    },
    memberCount: 89,
    postingGoal: {
      count: 3,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: true,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "foodies-unite",
    name: "Foodies Unite",
    description: "Share your culinary creations, restaurant finds, and recipe experiments",
    category: "food",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-3",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-3": "admin",
    },
    memberCount: 234,
    postingGoal: {
      count: 2,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "mindful-meditation",
    name: "Mindful Meditation",
    description: "Daily meditation sessions, mindfulness tips, and mental wellness practices",
    category: "wellness",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-4",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-4": "viewer",
    },
    memberCount: 178,
    postingGoal: {
      count: 1,
      frequency: "day",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "travel-explorers",
    name: "Travel Explorers",
    description: "Share travel stories, hidden gems, and adventure planning tips",
    category: "travel",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-5",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-5": "admin",
    },
    memberCount: 312,
    postingGoal: {
      count: 3,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "creative-writers",
    name: "Creative Writers Circle",
    description: "Writing prompts, story sharing, and creative writing workshops",
    category: "arts",
    visibility: "public",
    membership: "invite-only",
    createdBy: "sample-user-6",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-6": "member",
    },
    memberCount: 145,
    postingGoal: {
      count: 2,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: true,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "plant-parents",
    name: "Plant Parents",
    description: "Indoor gardening tips, plant care advice, and green space inspiration",
    category: "lifestyle",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-7",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-7": "viewer",
    },
    memberCount: 267,
    postingGoal: {
      count: 4,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
  {
    id: "music-makers",
    name: "Music Makers",
    description: "Share your music, get feedback, and collaborate with other musicians",
    category: "music",
    visibility: "public",
    membership: "open",
    createdBy: "sample-user-8",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
    memberRoles: {
      "sample-user-8": "admin",
    },
    memberCount: 198,
    postingGoal: {
      count: 3,
      frequency: "week",
      scope: "person",
    },
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      notificationsEnabled: true,
    },
    isActive: true,
  },
];

interface GroupListProps {
  groups: Array<DbGroup & { id: string }>;
}

export function GroupList({ groups }: GroupListProps) {
  const router = useRouter();
  const allGroups = [...groups, ...SAMPLE_GROUPS];

  return (
    <View className="gap-y-4">
      {allGroups.map(group => (
        <Pressable key={group.id} onPress={() => router.push(`/(groups)/${group.id}`)}>
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
