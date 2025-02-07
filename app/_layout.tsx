import { Stack } from "expo-router";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { useProfileSetup } from "@/hooks/useProfileSetup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@/hooks/useToast";

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
      <Stack.Screen name="(create)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
