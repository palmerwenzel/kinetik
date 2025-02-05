/**
 * A test component to verify our neumorphic design system
 */
import { View } from "react-native";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export function TestComponent() {
  return (
    <Container variant="flat" className="flex-1 items-center justify-center">
      <Text size="lg" weight="bold" className="mb-4">
        Neumorphic Design System
      </Text>

      {/* Button variants */}
      <View className="space-y-4 w-full max-w-sm">
        <Button variant="primary" onPress={() => console.log("Primary pressed")}>
          <Text>Primary Button</Text>
        </Button>

        <Button variant="secondary" onPress={() => console.log("Secondary pressed")}>
          <Text>Secondary Button</Text>
        </Button>

        <Button variant="ghost" onPress={() => console.log("Ghost pressed")}>
          <Text>Ghost Button</Text>
        </Button>

        <Button variant="primary" isLoading onPress={() => {}}>
          <Text>Loading State</Text>
        </Button>

        <Button variant="primary" isDisabled onPress={() => {}}>
          <Text>Disabled State</Text>
        </Button>
      </View>
    </Container>
  );
}
