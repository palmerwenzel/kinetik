import { useCallback, useState } from "react";
import { View, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { VideoFeed } from "@/components/video/VideoFeed";
import { useGroupVideos } from "@/hooks/useGroupVideos";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsFocused } from "@react-navigation/native";
import { useGroup } from "@/hooks/useGroup";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useUserGroups } from "@/hooks/useUserGroups";

export default function GroupVideoFeedScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const router = useRouter();
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { groups: userGroups, isLoading: isLoadingUserGroups } = useUserGroups();
  const { group, isLoading: isLoadingGroup, error } = useGroup(groupId);
  const { videos, isLoading, hasMore, loadMore, refresh } = useGroupVideos(groupId);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  const handleLike = useCallback((videoId: string) => {
    // Like functionality will be handled by VideoPlayer component
  }, []);

  const handleComment = useCallback((videoId: string) => {
    // Comment functionality will be handled by VideoPlayer component
  }, []);

  const handleShare = useCallback((videoId: string) => {
    // Share functionality will be handled by VideoPlayer component
  }, []);

  // Show loading state while checking groups
  if (isLoadingGroup || isLoadingUserGroups) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingSpinner />
      </View>
    );
  }

  // If there's an error (including permissions error)
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <View className="bg-error/10 rounded-full p-6 mb-6">
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        </View>
        <Text size="xl" weight="bold" className="text-center mb-2">
          {error === "Missing or insufficient permissions." ? "No Access" : "Something went wrong"}
        </Text>
        <Text intent="muted" className="text-center mb-6">
          {error === "Missing or insufficient permissions."
            ? "You don't have permission to view this group. Try joining the group first."
            : error}
        </Text>
        <View className="w-full space-y-4">
          <Button
            variant="neu-pressed"
            textComponent={<Text>Go Back</Text>}
            onPress={() => router.back()}
            className="w-full"
          />
          <Button
            variant="neu-accent"
            textComponent={<Text intent="button-accent">Find Groups</Text>}
            onPress={() => router.push("/(app)/explore")}
            className="w-full"
          />
        </View>
      </View>
    );
  }

  // If user has no groups, show create group CTA
  if (!userGroups || userGroups.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <View className="bg-accent/10 rounded-full p-6 mb-6">
          <Ionicons name="people" size={48} color="#FF6B00" />
        </View>
        <Text size="xl" weight="bold" className="text-center mb-2">
          Create Your First Group
        </Text>
        <Text intent="muted" className="text-center mb-6">
          Start sharing videos with your friends by creating a group!
        </Text>
        <Button
          variant="neu-accent"
          textComponent={
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" className="mr-2" />
              <Text intent="button-accent">Create Group</Text>
            </View>
          }
          onPress={() => router.push("/(groups)/createGroup")}
        />
      </View>
    );
  }

  // If group doesn't exist or user doesn't have access, redirect to groups list
  if (!group) {
    router.replace("/(app)");
    return null;
  }

  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" padding="none" className="flex-1">
        {/* Group Header */}
        <View className="absolute top-3 left-0 right-0 z-10 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -m-2">
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>

            <View className="flex-1 max-w-[50%] items-center mx-4">
              <Text numberOfLines={2} className="text-white font-semibold text-lg text-center">
                {group.name}
              </Text>
              <Text numberOfLines={1} className="text-white/80 text-sm">
                {videos.length} videos
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/(groups)/${groupId}/chat`)}
              className="p-2 -m-2"
            >
              <Ionicons name="chevron-forward" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Feed */}
        {videos.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center p-4">
            <View className="bg-accent/10 rounded-full p-6 mb-6">
              <Ionicons name="videocam" size={48} color="#FF6B00" />
            </View>
            <Text size="xl" weight="bold" className="text-center mb-2">
              No Videos Yet
            </Text>
            <Text intent="muted" className="text-center mb-6">
              Be the first to share a video in this group!
            </Text>
            <Button
              variant="neu-accent"
              textComponent={
                <View className="flex-row items-center">
                  <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" className="mr-2" />
                  <Text intent="button-accent">Create Video</Text>
                </View>
              }
              onPress={() => router.push("/(create)")}
            />
          </View>
        ) : (
          <VideoFeed
            videos={videos}
            isScreenFocused={isFocused}
            onEndReached={handleEndReached}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            useFullHeight
            groupId={groupId}
          />
        )}
      </AnimatedContainer>
    </View>
  );
}
