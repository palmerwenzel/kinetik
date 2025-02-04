import { Tabs } from "expo-router";
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      {/* Add more tab screens as needed */}
    </Tabs>
  );
}
