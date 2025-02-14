import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/hooks/useToast";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ToastProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="(app)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(groups)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </ToastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
