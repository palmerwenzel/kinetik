// Updated VideoFeed.tsx
// Only minor or no structural changes here; the main fix is in VideoPlayer.tsx
// but we include the full file as requested.

import { useCallback, useRef, useState, useEffect } from "react";
import { Dimensions, View, FlatList, ViewToken } from "react-native";
import { VideoPlayer } from "./VideoPlayer";
import { useVideoViews } from "@/hooks/useVideoViews";

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  blurredThumbnailUrl?: string;
  createdBy: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isProcessed: boolean;
}

interface VideoFeedProps {
  videos: VideoItem[];
  isScreenFocused: boolean;
  useFullHeight?: boolean;
  groupId?: string;
  onEndReached?: () => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const BOTTOM_NAV_HEIGHT = 60; // Height of the bottom navigation bar
const MINIMUM_VIEW_TIME = 2000; // 2 seconds minimum view time

// Track preloaded video URLs with their positions relative to current
const preloadCache = new Map<string, "prev" | "current" | "next">();

export function VideoFeed({
  videos,
  isScreenFocused,
  useFullHeight = false,
  groupId,
  onEndReached,
  onLike,
  onComment,
  onShare,
}: VideoFeedProps) {
  const VIDEO_HEIGHT = useFullHeight ? WINDOW_HEIGHT : WINDOW_HEIGHT - BOTTOM_NAV_HEIGHT;
  const [activeIndex, setActiveIndex] = useState(0);
  const { markAsViewed } = useVideoViews();
  const viewTimeoutRef = useRef<NodeJS.Timeout>();
  const lastViewedRef = useRef<string>();

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 250,
  };

  // Mark video as viewed after minimum view time
  useEffect(() => {
    if (isScreenFocused && videos[activeIndex]) {
      const currentVideoId = videos[activeIndex].id;

      // Clear any existing timeout
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
      }

      // Only set timeout if this video hasn't been viewed in this session
      if (lastViewedRef.current !== currentVideoId) {
        viewTimeoutRef.current = setTimeout(() => {
          markAsViewed(currentVideoId);
          lastViewedRef.current = currentVideoId;
        }, MINIMUM_VIEW_TIME);
      }
    }

    return () => {
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
      }
    };
  }, [activeIndex, isScreenFocused, videos, markAsViewed]);

  // Manage the sliding window of loaded videos
  useEffect(() => {
    if (!videos.length) return;

    const currentVideo = videos[activeIndex];
    const prevVideo = activeIndex > 0 ? videos[activeIndex - 1] : null;
    const nextVideo = activeIndex < videos.length - 1 ? videos[activeIndex + 1] : null;

    // Clear old cache entries
    preloadCache.clear();

    // Set new positions
    if (prevVideo) preloadCache.set(prevVideo.videoUrl, "prev");
    if (currentVideo) preloadCache.set(currentVideo.videoUrl, "current");
    if (nextVideo) preloadCache.set(nextVideo.videoUrl, "next");
  }, [activeIndex, videos]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length === 1) {
        const index = viewableItems[0].index ?? 0;
        setActiveIndex(index);

        if (onEndReached && index === videos.length - 1) {
          onEndReached();
        }
      }
    }
  ).current;

  const renderItem = useCallback(
    ({ item, index }: { item: VideoItem; index: number }) => {
      const position = preloadCache.get(item.videoUrl);
      const shouldPreload = position === "prev" || position === "next";

      return (
        <View style={{ width: "100%", height: VIDEO_HEIGHT }}>
          <VideoPlayer
            videoId={item.id}
            videoUrl={item.videoUrl}
            thumbnailUrl={item.thumbnailUrl}
            blurredThumbnailUrl={item.blurredThumbnailUrl}
            createdBy={item.createdBy}
            caption={item.caption}
            likes={item.likes}
            comments={item.comments}
            shares={item.shares}
            isActive={index === activeIndex && isScreenFocused}
            onLike={() => onLike?.(item.id)}
            onComment={() => onComment?.(item.id)}
            onShare={() => onShare?.(item.id)}
            shouldPreload={shouldPreload}
            useFullHeight={useFullHeight}
          />
        </View>
      );
    },
    [activeIndex, isScreenFocused, onLike, onComment, onShare, VIDEO_HEIGHT, useFullHeight]
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      windowSize={5}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={100}
      removeClippedSubviews={false}
      getItemLayout={(_, index) => ({
        length: VIDEO_HEIGHT,
        offset: VIDEO_HEIGHT * index,
        index,
      })}
    />
  );
}
