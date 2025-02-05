import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function CreateScreen() {
  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" className="flex-1 px-4 py-12">
        <View className="flex-1 items-center justify-center">
          <View className="mb-6">
            <Text size="3xl" weight="bold" className="text-center">
              Create
            </Text>
            <Text intent="muted" className="text-center mb-8">
              Share your journey
            </Text>
          </View>

          <Button
            variant="neu-pressed"
            className="w-48 h-48 rounded-3xl items-center justify-center"
            onPress={() => {}}
          >
            <Ionicons name="videocam" size={48} color="#FF6B00" />
            <Text intent="accent" className="mt-4">
              Record Video
            </Text>
          </Button>
        </View>
      </AnimatedContainer>
    </View>
  );
}
