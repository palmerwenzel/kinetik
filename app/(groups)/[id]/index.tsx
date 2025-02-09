import { useCallback, useEffect, useState } from "react";
import { View, RefreshControl } from "react-native";
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

export default function GroupVideoFeedScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const router = useRouter();
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { group, isLoading: isLoadingGroup } = useGroup(groupId);
  const { videos, isLoading, error, hasMore, loadMore, refresh } = useGroupVideos(groupId);

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

  if (isLoadingGroup) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingSpinner />
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center mb-4">This group doesn't exist or you don't have access.</Text>
        <Button
          variant="neu-pressed"
          textComponent={<Text>Go Back</Text>}
          onPress={() => router.back()}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text intent="error" className="text-center mb-4">
          {error}
        </Text>
        <Button variant="neu-pressed" textComponent={<Text>Try Again</Text>} onPress={refresh} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <AnimatedContainer variant="flat-surface" className="flex-1">
        {/* Group Header */}
        <View className="absolute top-0 left-0 right-0 z-10 bg-black/50 px-4 py-3">
          <View className="flex-row items-center">
            <Button
              variant="ghost"
              size="icon"
              textComponent={<Ionicons name="arrow-back" size={24} color="white" />}
              onPress={() => router.back()}
              className="mr-3"
            />
            <View>
              <Text className="text-white font-semibold text-lg">{group.name}</Text>
              <Text className="text-white/80 text-sm">{videos.length} videos</Text>
            </View>
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
            isLoading={isLoading}
          />
        )}
      </AnimatedContainer>
    </View>
  );
}
