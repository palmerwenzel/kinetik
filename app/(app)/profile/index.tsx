import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" className="flex-1 px-4 py-12">
        <View className="mb-6">
          <Text size="3xl" weight="bold" className="text-center">
            Profile
          </Text>
          <Text intent="muted" className="text-center">
            {user?.email}
          </Text>
        </View>

        <Button
          variant="neu-pressed"
          textComponent={<Text intent="accent">Sign Out</Text>}
          onPress={signOut}
          className="mt-4"
        />
      </AnimatedContainer>
    </View>
  );
}
