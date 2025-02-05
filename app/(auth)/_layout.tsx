import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200, // Faster fade for smoother transition with our custom animations
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen
        name="profileSetup"
        options={{
          gestureEnabled: false, // Prevent going back to signup
        }}
      />
    </Stack>
  );
}
