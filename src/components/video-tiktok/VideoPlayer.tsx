import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  Share,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

export function VideoPlayer({
  uri,
  isActive,
  isBecomingActive,
  poster,
  username,
  description,
  sound,
  likes,
  comments,
  shares,
  onLike,
  onComment,
  onShare,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const heartScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const [showComments, setShowComments] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      if (videoRef.current) {
        try {
          videoRef.current.stopAsync();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    };
  }, []);

  // Handle active state changes
  useEffect(() => {
    if (!videoRef.current || !isMounted || !isVideoReady) return;

    const video = videoRef.current;
    const updatePlaybackStatus = async () => {
      try {
        if (isBecomingActive) {
          await video.setPositionAsync(0);
          await video.playAsync();
          setIsPlaying(true);
        } else if (!isActive && !isBecomingActive) {
          await video.pauseAsync();
          setIsPlaying(false);
        }
      } catch (error) {
        // Silently handle errors during playback state changes
        console.debug("Playback status update error:", error);
      }
    };

    updatePlaybackStatus();
  }, [isActive, isBecomingActive, isMounted, isVideoReady]);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded || !isMounted || !isVideoReady) return;

      if (status.didJustFinish) {
        try {
          videoRef.current?.replayAsync();
        } catch (error) {
          console.debug("Replay error:", error);
        }
      }

      if (status.durationMillis) {
        const newProgress = status.positionMillis / status.durationMillis;
        setProgress(newProgress);
        progressWidth.value = withTiming(newProgress * WINDOW_WIDTH, {
          duration: 100,
          easing: Easing.linear,
        });
      }
    },
    [isMounted, isVideoReady]
  );

  return (
    <View className="flex-1">
      <Pressable onPress={handleTapToPlayPause} className="flex-1">
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black">
            {poster ? (
              <Image
                source={{ uri: poster }}
                className="absolute inset-0 w-full h-full"
                resizeMode="cover"
              />
            ) : null}
            <ActivityIndicator color="white" />
          </View>
        )}

        <Video
          ref={videoRef}
          source={{ uri }}
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            opacity: isLoading ? 0 : 1, // Hide video until loaded
          }}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isBecomingActive && isVideoReady}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => {
            if (isMounted) {
              setIsLoading(false);
              setIsVideoReady(true);
              if (isActive || isBecomingActive) {
                setIsPlaying(true);
              }
            }
          }}
          onError={error => {
            if (isMounted) {
              console.debug("Video load error:", error);
              onError?.("Failed to load video");
            }
          }}
          posterSource={poster ? { uri: poster } : undefined}
          usePoster
          isMuted={false}
        />

        {/* Rest of the JSX stays the same */}
      </Pressable>
    </View>
  );
}
