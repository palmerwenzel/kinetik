// Updated VideoPlayer.tsx
// Simplified the fade-in logic so that the thumbnail always remains
// until the video is truly ready. This fixes the blank screen issue
// when scrolling quickly between items.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
  Image,
  Text,
  Share,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import { useVideoLikes } from "@/hooks/useVideoLikes";
import { useUserProfile } from "@/hooks/useUserProfile";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const BOTTOM_NAV_HEIGHT = 60; // Height of the bottom navigation bar

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  blurredThumbnailUrl?: string;
  createdBy: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isActive: boolean;
  shouldPreload?: boolean;
  useFullHeight?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timeAgo: string;
}

// For brevity, kept the same. Renders a single comment.
function CommentItem({ comment }: { comment: Comment }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(prev => !prev);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-row items-start py-3 px-4">
      <Image
        source={{ uri: `https://picsum.photos/seed/${comment.username}/100/100` }}
        className="w-8 h-8 rounded-full"
      />
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-gray-800">{comment.username}</Text>
        <Text className="text-gray-600 mt-1">{comment.text}</Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-gray-400 text-xs">{comment.timeAgo}</Text>
          <Pressable onPress={handleLike} className="flex-row items-center ml-4">
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={14}
              color={isLiked ? "#f97316" : "#666"}
            />
            <Text className="text-gray-400 text-xs ml-1">
              {isLiked ? comment.likes + 1 : comment.likes}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

// Renders and manages the comments modal
function CommentsModal({
  visible,
  onClose,
  totalComments,
}: {
  visible: boolean;
  onClose: () => void;
  totalComments: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments([
      { id: "1", username: "fitness_lover", text: "Great form! 💪", likes: 24, timeAgo: "2h" },
      { id: "2", username: "tech_guru", text: "This is amazing!", likes: 15, timeAgo: "1h" },
      { id: "3", username: "health_coach", text: "Keep it up! 🔥", likes: 32, timeAgo: "30m" },
    ]);
  }, []);

  const handleSubmitComment = useCallback(() => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCommentObj = {
      id: Date.now().toString(),
      username: "you",
      text: trimmed,
      likes: 0,
      timeAgo: "now",
    };
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  }, [newComment]);

  const loadMoreComments = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const more = [...Array(3)].map((_, i) => ({
        id: (Date.now() + i).toString(),
        username: `user_${Math.random().toString(36).slice(2, 7)}`,
        text: "This is amazing! 🔥",
        likes: Math.floor(Math.random() * 100),
        timeAgo: `${Math.floor(Math.random() * 24)}h`,
      }));
      setComments(prev => [...prev, ...more]);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/50">
        <View className="flex-1" />
        <View className="h-[75%] bg-white rounded-t-3xl overflow-hidden">
          <View className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="p-2 -m-2 rounded-full active:bg-gray-100"
            >
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
            <Text className="font-semibold text-gray-800 text-lg">{totalComments} comments</Text>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            data={comments}
            renderItem={({ item }) => <CommentItem comment={item} />}
            keyExtractor={item => item.id}
            onEndReached={loadMoreComments}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={
              isLoading ? (
                <View className="py-4">
                  <ActivityIndicator color="#f97316" />
                </View>
              ) : null
            }
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="border-t border-gray-200 px-4 py-2 bg-white"
          >
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-gray-800 text-base"
                placeholder="Add a comment..."
                placeholderTextColor="#666"
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={handleSubmitComment}
                returnKeyType="send"
                autoFocus
              />
              <Pressable
                onPress={handleSubmitComment}
                disabled={!newComment.trim()}
                className="ml-2 p-2 -mr-2"
              >
                <Ionicons name="send" size={24} color={newComment.trim() ? "#f97316" : "#999"} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Pressable>
    </Modal>
  );
}

export function VideoPlayer({
  videoId,
  videoUrl,
  thumbnailUrl,
  blurredThumbnailUrl,
  createdBy,
  caption,
  likes,
  comments,
  shares,
  isActive,
  shouldPreload,
  useFullHeight = false,
  onLike,
  onComment,
  onShare,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);

  const heartScale = useSharedValue(1);
  const { likedVideos, toggleLike, checkIfLiked } = useVideoLikes();
  const { getUserProfile } = useUserProfile();
  const [username, setUsername] = useState<string>("...");
  const isLiked = likedVideos.has(videoId);
  const [localLikes, setLocalLikes] = useState(likes);

  const progress = useSharedValue(0);

  // Fetch author username
  useEffect(() => {
    let mounted = true;
    (async function () {
      const profile = await getUserProfile(createdBy);
      if (mounted && profile?.username) setUsername(profile.username);
    })();
    return () => {
      mounted = false;
    };
  }, [createdBy, getUserProfile]);

  // Check if the video is liked initially
  useEffect(() => {
    checkIfLiked(videoId);
  }, [videoId, checkIfLiked]);

  // Update playback state based on active status
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setUserPaused(false);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Preload the video when not active but it's nearby in the list
  useEffect(() => {
    if (shouldPreload && videoRef.current && !isActive) {
      videoRef.current
        .loadAsync({ uri: videoUrl }, { shouldPlay: false, isLooping: true })
        .catch(() => {
          // Ignore preload errors
        });
    }
  }, [shouldPreload, videoUrl, isActive]);

  // Whenever the video changes, reset readiness
  useEffect(() => {
    setIsVideoReady(false);
    setIsThumbnailLoaded(false);
    progress.value = 0;
  }, [videoId]);

  // Animate video opacity based on readiness
  const animatedOpacity = useSharedValue(0);
  useEffect(() => {
    // Fade in or out
    animatedOpacity.value = withTiming(isVideoReady ? 1 : 0, { duration: 200 });
  }, [isVideoReady, animatedOpacity]);

  const videoAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: animatedOpacity.value };
  });

  // Keep updating progress for the progress bar
  const handleVideoStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        setIsVideoReady(false);
        return;
      }

      // If loaded, mark as ready for display (which triggers fade in)
      setIsVideoReady(true);

      // Update progress
      if (status.durationMillis) {
        progress.value = withTiming(status.positionMillis / status.durationMillis, {
          duration: 250,
        });
      }

      // Loop the video
      if (status.didJustFinish && videoRef.current) {
        videoRef.current.replayAsync().catch(() => {});
        progress.value = 0;
      }
    },
    [progress]
  );

  const handleTapToPlayPause = useCallback(() => {
    if (isPlaying) {
      setUserPaused(true);
    } else {
      setUserPaused(false);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleLikePress = useCallback(async () => {
    if (!isLiked) {
      heartScale.value = withSequence(
        withSpring(1.5, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await toggleLike(videoId, localLikes);
    if (result.success) {
      setLocalLikes(result.likes);
    }
    onLike?.();
  }, [isLiked, heartScale, videoId, localLikes, toggleLike, onLike]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleCommentPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowComments(true);
    onComment?.();
  }, [onComment]);

  const handleSharePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await Share.share({
        message: `Check out this video from ${createdBy}!`,
        url: videoUrl,
      });
      if (result.action === Share.sharedAction) {
        onShare?.();
      }
    } catch {
      // Ignore errors
    }
  }, [createdBy, videoUrl, onShare]);

  // For the progress bar at the bottom
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const VIDEO_HEIGHT = useFullHeight ? WINDOW_HEIGHT : WINDOW_HEIGHT - BOTTOM_NAV_HEIGHT;

  return (
    <View className="flex-1">
      <Pressable onPress={handleTapToPlayPause} className="flex-1">
        {/* Blurred thumbnail if provided (shown until full thumbnail is loaded) */}
        {blurredThumbnailUrl && !isThumbnailLoaded && (
          <Image
            source={{ uri: blurredThumbnailUrl }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: WINDOW_WIDTH,
              height: VIDEO_HEIGHT,
              resizeMode: "cover",
            }}
            blurRadius={10}
          />
        )}

        {/* Full resolution thumbnail stays visible while
            the video is not ready or this item isn't active */}
        {thumbnailUrl && (!isVideoReady || !isActive) && (
          <Image
            source={{ uri: thumbnailUrl }}
            onLoad={() => setIsThumbnailLoaded(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: WINDOW_WIDTH,
              height: VIDEO_HEIGHT,
              resizeMode: "cover",
            }}
          />
        )}

        {/* Actual Video (fades in once ready) */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: WINDOW_WIDTH,
              height: VIDEO_HEIGHT,
            },
            videoAnimatedStyle,
          ]}
        >
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={{ width: WINDOW_WIDTH, height: VIDEO_HEIGHT }}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={isActive && !userPaused}
            onPlaybackStatusUpdate={handleVideoStatusUpdate}
            isMuted={false}
            progressUpdateIntervalMillis={250}
            positionMillis={0}
            shouldCorrectPitch={false}
            rate={1.0}
          />
        </Animated.View>

        {/* Progress Bar */}
        <View className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/20">
          <Animated.View className="h-full bg-orange-500" style={progressBarStyle} />
        </View>

        {/* Right sidebar buttons */}
        <View className="absolute right-4 bottom-20 items-center">
          <AnimatedPressable onPress={handleLikePress} style={heartStyle}>
            <View className="items-center mb-4">
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={35}
                color={isLiked ? "#f97316" : "white"}
              />
              <Text className="text-white text-xs mt-1">{localLikes}</Text>
            </View>
          </AnimatedPressable>

          <Pressable onPress={handleCommentPress} className="items-center mb-4">
            <Ionicons name="chatbubble-outline" size={32} color="white" />
            <Text className="text-white text-xs mt-1">{comments}</Text>
          </Pressable>

          <Pressable onPress={handleSharePress} className="items-center">
            <Ionicons name="share-outline" size={32} color="white" />
            <Text className="text-white text-xs mt-1">{shares}</Text>
          </Pressable>
        </View>

        {/* Bottom text content */}
        <View className="absolute bottom-4 left-4 right-20">
          <Text className="text-white text-lg font-semibold mb-1">@{username}</Text>
          <Text className="text-white">{caption}</Text>
        </View>

        {/* Play Icon Overlay (show for user-initiated pauses) */}
        {!isPlaying && userPaused && isActive && (
          <View className="absolute inset-0 items-center justify-center">
            <Ionicons name="play" size={70} color="white" style={{ opacity: 0.8 }} />
          </View>
        )}
      </Pressable>

      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        totalComments={comments}
      />
    </View>
  );
}
