import { Stack } from "expo-router";

export default function GroupsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
      }}
    />
  );
}
