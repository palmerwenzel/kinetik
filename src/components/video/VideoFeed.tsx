import { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { VideoPlayer } from "./VideoPlayer";
import { Feather } from "@expo/vector-icons";

interface Video {
  id: string;
  uri: string;
  creator: string;
}

interface VideoFeedProps {
  videos: Video[];
  onEndReached?: () => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = WINDOW_HEIGHT * 0.2;

// Spring animation config for smoother transitions
const SPRING_CONFIG = {
  damping: 50,
  mass: 1,
  stiffness: 50,
  overshootClamping: false,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
};

// Timing config for when using timing animations
const TIMING_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1), // ease
};

// Neumorphic styles for buttons
const BUTTON_SHADOW = {
  shadowColor: "#fff",
  shadowOffset: { width: -2, height: -2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
};

const BUTTON_SHADOW_PRESSED = {
  shadowColor: "#000",
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
};

function EngagementButton({
  icon,
  label,
  onPress,
  isActive,
  activeColor = "#ff4d4f",
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  activeColor?: string;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={[
        {
          alignItems: "center",
          marginVertical: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 12,
          padding: 8,
        },
        isPressed ? BUTTON_SHADOW_PRESSED : BUTTON_SHADOW,
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isActive ? activeColor : "rgba(255, 255, 255, 0.15)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Feather name={icon} size={24} color={isActive ? "#fff" : "white"} />
      </View>
      <Text style={{ color: isActive ? activeColor : "white" }} className="text-sm">
        {label}
      </Text>
    </Pressable>
  );
}

export function VideoFeed({ videos, onEndReached }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

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

  const handleLike = useCallback((videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  }, []);

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
      } else if (Math.abs(translateY.value) > SWIPE_THRESHOLD) {
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

  const rStyle = useAnimatedStyle(() => {
    // Always use the current value without additional spring interpolation
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!videos.length) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg">No videos available</Text>
      </View>
    );
  }

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
            const isActive = index === activeIndex;
            const isAdjacent = Math.abs(index - activeIndex) === 1;
            const shouldRender = isActive || isAdjacent;
            const isLiked = likedVideos.has(video.id);

            if (!shouldRender) return null;

            const translateYValue = (index - activeIndex) * WINDOW_HEIGHT;

            // Assign tags based on video ID (for demo purposes)
            const tags = [
              video.id === "1" ? "programming" : null,
              video.id === "2" ? "AI" : null,
              video.id === "3" ? "lifting" : null,
              video.id === "4" ? "running" : null,
            ].filter(Boolean) as string[];

            return (
              <View
                key={video.id}
                className="absolute inset-0"
                style={{
                  transform: [{ translateY: translateYValue }],
                }}
              >
                <VideoPlayer
                  uri={video.uri}
                  isActive={isActive}
                  onError={error => console.error(`Video ${video.id} error:`, error)}
                  onLoad={() => {
                    if (!loadedVideos.has(video.id)) {
                      setLoadedVideos(prev => new Set([...prev, video.id]));
                    }
                  }}
                />

                {/* Engagement buttons */}
                <View className="absolute right-4 bottom-20" style={{ alignItems: "center" }}>
                  <EngagementButton
                    icon="heart"
                    label="Like"
                    isActive={isLiked}
                    onPress={() => handleLike(video.id)}
                  />
                  <EngagementButton
                    icon="share"
                    label="Share"
                    onPress={() => console.log("Share pressed")}
                  />
                  <EngagementButton
                    icon="more-vertical"
                    label="More"
                    onPress={() => console.log("More pressed")}
                  />
                </View>

                {/* Creator info */}
                <View className="absolute bottom-4 left-4">
                  <Text className="text-white text-lg font-semibold mb-2">{video.creator}</Text>
                  <View className="flex-row gap-2">
                    {tags.map(tag => (
                      <View key={tag} className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white text-sm">#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
