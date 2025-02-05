import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

export default function FeedScreen() {
  return (
    <View className="flex-1 bg-black">
      <AnimatedContainer variant="transparent" className="flex-1 items-center justify-center">
        <Text size="xl" weight="bold" className="text-white text-center">
          Video Feed
        </Text>
        <Text intent="muted" className="text-center text-white/70">
          TikTok-style video content coming soon
        </Text>
      </AnimatedContainer>
    </View>
  );
}
