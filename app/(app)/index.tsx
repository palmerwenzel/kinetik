import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/lib/auth/AuthContext";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl mb-4">Welcome, {user.email}</Text>
      <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-lg" onPress={signOut}>
        <Text className="text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
