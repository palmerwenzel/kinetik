import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  tags: string[];
}

const DEMO_GROUPS: Group[] = [
  {
    id: "1",
    name: "Morning Runners Club",
    description:
      "Early birds catching those morning runs! Join us for daily motivation and tracking.",
    members: 128,
    tags: ["running", "morning", "fitness"],
  },
  {
    id: "2",
    name: "Tech Lifters",
    description: "Software engineers who love to lift. Where coding meets gains.",
    members: 256,
    tags: ["lifting", "tech", "strength"],
  },
  {
    id: "3",
    name: "AI Fitness Research",
    description: "Exploring the intersection of AI and fitness. Building the future of workouts.",
    members: 64,
    tags: ["AI", "research", "innovation"],
  },
  {
    id: "4",
    name: "Web Dev Warriors",
    description: "Full-stack developers sharing workout routines and coding tips.",
    members: 192,
    tags: ["programming", "web", "development"],
  },
];

function GroupCard({ group }: { group: Group }) {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <View
      className="mx-4 my-2 p-4 rounded-2xl"
      style={{
        backgroundColor: "#F0F0F3",
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{group.name}</Text>
          <Text className="text-sm text-gray-600 mt-1">{group.members} members</Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            className="px-4 py-2 rounded-xl"
            style={{
              backgroundColor: "#F0F0F3",
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
            onPress={() => console.log("View group:", group.id)}
          >
            <Text className="text-gray-800 font-medium">View</Text>
          </Pressable>
          <Pressable
            className="px-4 py-2 rounded-xl"
            style={{
              backgroundColor: isJoined ? "#FF6B00" : "#F0F0F3",
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
            onPress={() => setIsJoined(!isJoined)}
          >
            <Text className="font-medium" style={{ color: isJoined ? "#fff" : "#666666" }}>
              {isJoined ? "Joined" : "Join"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text className="text-gray-600 mb-3">{group.description}</Text>

      <View className="flex-row flex-wrap gap-2">
        {group.tags.map(tag => (
          <View
            key={tag}
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(255, 107, 0, 0.1)",
            }}
          >
            <Text className="text-sm" style={{ color: "#FF6B00" }}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-[#F0F0F3] pt-12">
      <View className="px-4 mb-4">
        <Text className="text-2xl font-bold text-gray-800">Explore Groups</Text>
        <Text className="text-gray-600 mt-1">Find your perfect fitness community</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {DEMO_GROUPS.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </ScrollView>
    </View>
  );
}
