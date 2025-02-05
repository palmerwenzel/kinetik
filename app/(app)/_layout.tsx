import { Tabs } from "expo-router";
import { Text } from "@/components/ui/Text";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth/AuthContext";
import { Redirect } from "expo-router";

export default function AppLayout() {
  const { user } = useAuth();

  // Require authentication for app routes
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F0F0F3",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "#666666",
      }}
    >
      {/* Hidden index route for redirection */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Prevents the tab from showing in the tab bar
        }}
      />

      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="feed/index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              Feed
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              Create
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
