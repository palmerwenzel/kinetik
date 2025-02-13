import { View, Image, ScrollView, RefreshControl } from "react-native";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/Button";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

// TODO: Create a profile edit screen at app/(app)/profile/edit/index.tsx
// This will allow users to update their profile information like username, photo, etc.

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { getUserProfile, loadingProfiles } = useUserProfile();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fetch user profile data
  const [profile, setProfile] = React.useState<{ username: string; photoURL?: string } | null>(
    null
  );

  React.useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user?.uid, getUserProfile]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    if (user?.uid) {
      await getUserProfile(user.uid).then(setProfile);
    }
    setIsRefreshing(false);
  }, [user?.uid, getUserProfile]);

  return (
    <View className="flex-1 bg-background dark:bg-surface-dark">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#FF6B00" />
        }
      >
        <View className="flex-1 px-4 pt-12">
          <AnimatedContainer variant="flat-surface" className="flex-1">
            {/* Header Section */}
            <View className="items-center py-8">
              <View className="mb-4">
                {user?.photoURL || profile?.photoURL ? (
                  <Image
                    source={{ uri: user?.photoURL || profile?.photoURL }}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-accent/10 items-center justify-center">
                    <Ionicons name="person" size={48} color="#FF6B00" />
                  </View>
                )}
              </View>
              <Text size="2xl" weight="bold" className="mb-1">
                {user?.displayName || profile?.username || "Anonymous User"}
              </Text>
              <Text intent="muted" className="mb-4">
                {user?.email}
              </Text>
            </View>

            {/* Settings Sections */}
            <View className="gap-y-4">
              {/* Profile Section */}
              <AnimatedContainer variant="neu-surface" className="p-4">
                <View className="flex-row items-center">
                  <View className="bg-accent/10 rounded-full p-2 mr-3">
                    <Ionicons name="person-circle" size={24} color="#FF6B00" />
                  </View>
                  <View>
                    <Text weight="medium">Username</Text>
                    <Text size="sm" intent="muted">
                      @{profile?.username || "Not set"}
                    </Text>
                  </View>
                </View>
              </AnimatedContainer>

              {/* Appearance Section */}
              <AnimatedContainer variant="neu-surface" className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-accent/10 rounded-full p-2 mr-3">
                      <Ionicons name={isDark ? "moon" : "sunny"} size={24} color="#FF6B00" />
                    </View>
                    <View>
                      <Text weight="medium">Appearance</Text>
                      <Text size="sm" intent="muted">
                        {isDark ? "Dark Mode" : "Light Mode"}
                      </Text>
                    </View>
                  </View>
                  <Button
                    variant="neu-accent"
                    className="px-4 py-2"
                    onPress={toggleColorScheme}
                    textComponent={
                      <Text intent="onSurface" size="sm">
                        Toggle
                      </Text>
                    }
                  />
                </View>
              </AnimatedContainer>

              {/* Account Section */}
              <AnimatedContainer variant="neu-surface" className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="bg-accent/10 rounded-full p-2 mr-3">
                    <Ionicons name="shield-checkmark" size={24} color="#FF6B00" />
                  </View>
                  <Text weight="medium">Account</Text>
                </View>
                <View className="gap-y-2">
                  <Text size="sm" intent="muted">
                    Account Type: {user?.email ? "Email" : "Google"}
                  </Text>
                  <Text size="sm" intent="muted">
                    Email: {user?.email}
                  </Text>
                </View>
              </AnimatedContainer>
            </View>

            {/* Sign Out Button */}
            <View className="mt-8">
              <Button
                variant="neu-pressed"
                onPress={signOut}
                className="w-full"
                textComponent={
                  <View className="flex-row items-center">
                    <Ionicons name="log-out-outline" size={20} color="#FF6B00" />
                    <Text intent="accent" className="ml-2">
                      Sign Out
                    </Text>
                  </View>
                }
              />
            </View>
          </AnimatedContainer>
        </View>
      </ScrollView>
    </View>
  );
}
