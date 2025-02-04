import { View, Text } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { TestComponent } from '../src/components/ui/TestComponent';
import '../global.css';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-light dark:bg-bg-dark p-4">
      <Text className="text-2xl font-bold mb-8 text-accent">
        Welcome to Kinetik
      </Text>

      <View className="space-y-4 w-full max-w-sm">
        <Button variant="primary">
          Get Started
        </Button>

        <Button variant="secondary">
          Learn More
        </Button>

        <TestComponent />
      </View>
    </View>
  );
}
