import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useGroupInvites } from "@/hooks/useGroupInvites";
import { Ionicons } from "@expo/vector-icons";

export default function JoinGroupScreen() {
  const { code } = useLocalSearchParams();
  const inviteCode = typeof code === "string" ? code : "";
  const router = useRouter();
  const { validateAndAcceptInvite, isLoading, error } = useGroupInvites();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!inviteCode) {
      router.replace("/(app)");
    }
  }, [inviteCode, router]);

  const handleJoin = async () => {
    setIsJoining(true);
    const success = await validateAndAcceptInvite(inviteCode);
    setIsJoining(false);

    if (success) {
      // Navigate to the group
      router.replace(`/(groups)/${inviteCode}`);
    }
  };

  if (!inviteCode) return null;

  return (
    <AnimatedContainer variant="flat-surface" className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <>
            <View className="bg-error/10 rounded-full p-6 mb-6">
              <Ionicons name="alert-circle" size={48} color="#FF3B30" />
            </View>
            <Text size="xl" weight="bold" className="text-center mb-2">
              Invalid Invite
            </Text>
            <Text intent="muted" className="text-center mb-6">
              {error}
            </Text>
            <Button
              variant="neu-pressed"
              textComponent={<Text>Go Back</Text>}
              onPress={() => router.back()}
              className="w-full"
            />
          </>
        ) : (
          <>
            <View className="bg-accent/10 rounded-full p-6 mb-6">
              <Ionicons name="people" size={48} color="#FF6B00" />
            </View>
            <Text size="xl" weight="bold" className="text-center mb-2">
              Join Group
            </Text>
            <Text intent="muted" className="text-center mb-6">
              You&apos;ve been invited to join a group! Click below to accept the invitation.
            </Text>
            <View className="w-full space-y-4">
              <Button
                variant="neu-accent"
                textComponent={<Text intent="button-accent">Join Group</Text>}
                onPress={handleJoin}
                isLoading={isJoining}
                className="w-full"
              />
              <Button
                variant="neu-pressed"
                textComponent={<Text>Cancel</Text>}
                onPress={() => router.back()}
                isDisabled={isJoining}
                className="w-full"
              />
            </View>
          </>
        )}
      </View>
    </AnimatedContainer>
  );
}
