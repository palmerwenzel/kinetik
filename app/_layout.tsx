import { Stack } from "expo-router";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { useProfileSetup } from "@/lib/auth/useProfileSetup";

function RootLayoutNav() {
  const { isCheckingProfile } = useProfileSetup();

  // Optional: Show loading state while checking profile
  if (isCheckingProfile) {
    return null; // Or a loading spinner
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
