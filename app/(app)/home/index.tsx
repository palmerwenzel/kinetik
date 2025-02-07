import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" className="flex-1 px-4 py-12">
        <View className="flex-1 items-center justify-center">
          <View className="items-center self-center w-full max-w-[320px] mb-8">
            <View className="bg-accent/10 rounded-full p-6 mb-6 self-center">
              <Ionicons name="people" size={48} color="#FF6B00" />
            </View>
            <Text size="2xl" weight="bold" className="text-center mb-2">
              Find Your People
            </Text>
            <Text intent="muted" className="text-center mb-6">
              You haven&apos;t joined any groups yet. Don&apos;t worry—we&apos;ll help you connect
              with like-minded creators.
            </Text>
            <View className="w-full space-y-4">
              <View className="flex-row items-center w-full">
                <Button
                  variant="neu-accent"
                  textComponent={
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#FFFFFF"
                        className="mr-2"
                      />
                      <Text intent="button-accent">Create a Group</Text>
                    </View>
                  }
                  onPress={() => router.push("/(groups)/createGroup")}
                  className="flex-1"
                />
              </View>
              <View className="flex-row items-center w-full">
                <Button
                  variant="neu-raised"
                  textComponent={
                    <View className="flex-row items-center">
                      <Ionicons name="search-outline" size={20} color="#666666" className="mr-2" />
                      <Text>Explore Groups</Text>
                    </View>
                  }
                  onPress={() => router.push("/(app)/explore")}
                  className="flex-1"
                />
              </View>
            </View>
          </View>
        </View>
      </AnimatedContainer>
    </View>
  );
}
