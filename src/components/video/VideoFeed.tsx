import { useCallback, useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { VideoPlayer } from "../video/VideoPlayer";

interface Video {
  id: string;
  uri: string;
  poster?: string;
  username: string;
  description: string;
  sound: string;
  likes: number;
  comments: number;
  shares: number;
}

interface VideoFeedProps {
  videos: Video[];
  isScreenFocused: boolean;
  onEndReached?: () => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SPRING_CONFIG = {
  damping: 50,
  mass: 1,
  stiffness: 50,
  overshootClamping: false,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
};

export function VideoFeed({
  videos,
  isScreenFocused,
  onEndReached,
  onLike,
  onComment,
  onShare,
}: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Calculate which video is becoming active based on translation
  const getIsBecomingActive = useCallback(
    (index: number) => {
      "worklet";
      if (index === activeIndex) {
        // Current video is active unless we're dragging significantly away from it
        return Math.abs(translateY.value) < WINDOW_HEIGHT * 0.5;
      } else if (index === activeIndex + 1) {
        // Next video becomes active when dragging up significantly
        return translateY.value < -WINDOW_HEIGHT * 0.2;
      } else if (index === activeIndex - 1) {
        // Previous video becomes active when dragging down significantly
        return translateY.value > WINDOW_HEIGHT * 0.2;
      }
      return false;
    },
    [activeIndex, translateY.value]
  );

  // Ensure first video starts playing
  useEffect(() => {
    if (videos.length > 0 && !loadedVideos.has(videos[0].id)) {
      setLoadedVideos(prev => new Set([...prev, videos[0].id]));
    }
  }, [videos]);

  // Preload adjacent videos
  useEffect(() => {
    const preloadVideos = async () => {
      const indicesToLoad = [activeIndex - 1, activeIndex, activeIndex + 1].filter(
        index => index >= 0 && index < videos.length
      );

      indicesToLoad.forEach(index => {
        const video = videos[index];
        if (!loadedVideos.has(video.id)) {
          setLoadedVideos(prev => new Set([...prev, video.id]));
        }
      });
    };

    preloadVideos();
  }, [activeIndex, videos, loadedVideos]);

  const handleSwipeComplete = useCallback(
    (direction: "up" | "down", velocity = 0) => {
      "worklet";
      const nextIndex = direction === "up" ? activeIndex + 1 : activeIndex - 1;

      if (nextIndex < 0 || nextIndex >= videos.length) {
        // Bounce back if out of bounds with spring animation
        translateY.value = withSpring(0, {
          ...SPRING_CONFIG,
          velocity,
        });
        return;
      }

      const distance = direction === "up" ? -WINDOW_HEIGHT : WINDOW_HEIGHT;

      // Start moving to next position
      translateY.value = withSpring(
        distance,
        {
          ...SPRING_CONFIG,
          velocity,
        },
        finished => {
          if (finished) {
            // Only update index after animation completes
            translateY.value = 0;
            runOnJS(setActiveIndex)(nextIndex);

            if (direction === "up" && nextIndex === videos.length - 1 && onEndReached) {
              runOnJS(onEndReached)();
            }
          }
        }
      );
    },
    [activeIndex, videos.length, onEndReached]
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate(event => {
      // Add resistance when pulling beyond bounds
      const isFirstVideo = activeIndex === 0 && event.translationY > 0;
      const isLastVideo = activeIndex === videos.length - 1 && event.translationY < 0;

      if (isFirstVideo || isLastVideo) {
        translateY.value = event.translationY * 0.3; // Add resistance
      } else {
        translateY.value = event.translationY;
      }
    })
    .onEnd(event => {
      isDragging.value = false;
      const velocity = event.velocityY;

      if (Math.abs(velocity) > 500) {
        // Fast swipe - use velocity for natural continuation
        handleSwipeComplete(velocity > 0 ? "down" : "up", velocity);
      } else if (Math.abs(translateY.value) > WINDOW_HEIGHT * 0.2) {
        // Threshold reached - use current velocity for natural continuation
        handleSwipeComplete(translateY.value > 0 ? "down" : "up", velocity);
      } else {
        // Bounce back with spring, maintaining velocity
        translateY.value = withSpring(0, {
          ...SPRING_CONFIG,
          velocity,
        });
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1 bg-black">
        <Animated.View
          style={[
            {
              flex: 1,
              height: WINDOW_HEIGHT,
              position: "relative",
            },
            rStyle,
          ]}
        >
          {videos.map((video, index) => {
            const isActive = index === activeIndex && isScreenFocused;
            const isAdjacent = Math.abs(index - activeIndex) === 1;
            const shouldRender = isActive || isAdjacent;
            const isBecomingActive = getIsBecomingActive(index) && isScreenFocused;

            if (!shouldRender) return null;

            const translateYValue = (index - activeIndex) * WINDOW_HEIGHT;

            return (
              <View
                key={video.id}
                className="absolute inset-0"
                style={{
                  transform: [{ translateY: translateYValue }],
                }}
              >
                <VideoPlayer
                  {...video}
                  isActive={isActive}
                  isBecomingActive={isBecomingActive}
                  onLike={() => onLike?.(video.id)}
                  onComment={() => onComment?.(video.id)}
                  onShare={() => onShare?.(video.id)}
                  onError={error => console.error(`Video ${video.id} error:`, error)}
                />
              </View>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
