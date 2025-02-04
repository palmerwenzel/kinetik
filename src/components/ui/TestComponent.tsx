/**
 * A test component to verify NativeWind styling configuration
 */
import { View, Text, Pressable } from 'react-native';

export function TestComponent() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-bg-light dark:bg-bg-dark">
      <Text className="text-lg font-bold mb-4 text-black dark:text-white">
        NativeWind Test Component
      </Text>
      <Pressable 
        className="bg-accent hover:bg-accent-light active:bg-accent-dark px-4 py-2 rounded-neu"
        onPress={() => console.log('Button pressed')}
      >
        <Text className="text-white font-medium">
          Test Button
        </Text>
      </Pressable>
    </View>
  );
} 