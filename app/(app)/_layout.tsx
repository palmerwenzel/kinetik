import { Tabs } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
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

      {/* Main tab screens */}
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
        name="for-you/index"
        options={{
          title: "For You",
          tabBarIcon: ({ color, size }) => <Ionicons name="flame" size={size} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              For You
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
        name="explore/index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text intent="muted" size="xs" style={{ color }}>
              Explore
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
