import { useCallback, useRef, useState, useEffect } from "react";
import { Dimensions, View, FlatList, ViewToken } from "react-native";
import { VideoPlayer } from "./VideoPlayer";

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
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
  onEndReached?: () => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const BOTTOM_NAV_HEIGHT = 60; // Height of the bottom navigation bar
const VIDEO_HEIGHT = WINDOW_HEIGHT - BOTTOM_NAV_HEIGHT;

// Track preloaded video URLs with their positions relative to current
const preloadCache = new Map<string, "prev" | "current" | "next">();

export function VideoFeed({
  videos,
  isScreenFocused,
  onEndReached,
  onLike,
  onComment,
  onShare,
}: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 250,
  };

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
          />
        </View>
      );
    },
    [activeIndex, isScreenFocused, onLike, onComment, onShare]
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
