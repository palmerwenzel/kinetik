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

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
  isBecomingActive: boolean;
  poster?: string;
  username: string;
  description: string;
  sound: string;
  likes: number;
  comments: number;
  shares: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onError?: (error: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

// Demo comments data
const DEMO_COMMENTS = [
  { id: "1", username: "fitness_lover", text: "Great form! 💪", likes: 24, timeAgo: "2h" },
  { id: "2", username: "tech_guru", text: "This is amazing!", likes: 15, timeAgo: "1h" },
  { id: "3", username: "health_coach", text: "Keep it up! 🔥", likes: 32, timeAgo: "30m" },
];

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timeAgo: string;
}

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

function CommentsModal({
  visible,
  onClose,
  totalComments,
}: {
  visible: boolean;
  onClose: () => void;
  totalComments: number;
}) {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState(DEMO_COMMENTS);

  const handleSubmitComment = useCallback(() => {
    if (!newComment.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCommentObj = {
      id: Date.now().toString(),
      username: "you",
      text: newComment,
      likes: 0,
      timeAgo: "now",
    };
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  }, [newComment]);

  const loadMoreComments = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const moreComments = [...Array(3)].map((_, i) => ({
        id: (Date.now() + i).toString(),
        username: `user_${Math.random().toString(36).slice(2, 7)}`,
        text: "This is amazing! 🔥",
        likes: Math.floor(Math.random() * 100),
        timeAgo: `${Math.floor(Math.random() * 24)}h`,
      }));
      setComments(prev => [...prev, ...moreComments]);
      setIsLoading(false);
    }, 1000);
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
  const [isPlaying, setIsPlaying] = useState(isActive);
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
    if (!videoRef.current || !isMounted) return;

    const video = videoRef.current;
    const updatePlaybackStatus = async () => {
      try {
        if (isBecomingActive) {
          // Reset to beginning and play when becoming active
          await video.setPositionAsync(0);
          await video.playAsync();
          setIsPlaying(true);
        } else if (!isActive && !isBecomingActive) {
          await video.pauseAsync();
          setIsPlaying(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Playback status update error:", error);
        }
      }
    };

    updatePlaybackStatus();
  }, [isActive, isBecomingActive, isMounted]);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded || !isMounted) return;

      if (status.didJustFinish) {
        try {
          videoRef.current?.replayAsync();
        } catch (error) {
          if (isMounted) {
            console.error("Replay error:", error);
          }
        }
      }

      // Update progress bar
      if (status.durationMillis) {
        const newProgress = status.positionMillis / status.durationMillis;
        setProgress(newProgress);
        progressWidth.value = withTiming(newProgress * WINDOW_WIDTH, {
          duration: 100,
          easing: Easing.linear,
        });
      }
    },
    [isMounted]
  );

  const handleTapToPlayPause = useCallback(() => {
    if (!isMounted || !videoRef.current) return;

    const video = videoRef.current;
    if (isPlaying) {
      video.pauseAsync().catch(console.error);
    } else {
      video.playAsync().catch(console.error);
    }
    setIsPlaying(prev => !prev);
  }, [isMounted, isPlaying]);

  const handleLike = useCallback(() => {
    if (!isMounted) return;
    setIsLiked(prev => !prev);
    if (!isLiked) {
      heartScale.value = withSequence(
        withSpring(1.5, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }
    onLike?.();
  }, [isLiked, onLike, isMounted]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
    height: 2,
    backgroundColor: "#f97316", // orange-500
    position: "absolute",
    bottom: 0,
    left: 0,
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
        message: `Check out this video from ${username}!`,
        url: uri,
      });
      if (result.action === Share.sharedAction) {
        onShare?.();
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  }, [username, uri, onShare]);

  return (
    <View className="flex-1">
      <Pressable onPress={handleTapToPlayPause} className="flex-1">
        <Video
          ref={videoRef}
          source={{ uri }}
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
          }}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isBecomingActive} // Use isBecomingActive instead of just isActive
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => {
            if (isMounted) {
              setIsLoading(false);
              if (isActive || isBecomingActive) {
                setIsPlaying(true);
              }
            }
          }}
          onError={() => {
            if (isMounted) {
              onError?.("Failed to load video");
            }
          }}
          posterSource={poster ? { uri: poster } : undefined}
          usePoster
          isMuted={false}
        />

        {/* Progress bar - moved to bottom */}
        <View className="absolute left-0 bottom-0.5 right-0 h-0.5 bg-orange-500/20">
          <Animated.View style={progressBarStyle} />
        </View>

        {/* Right sidebar actions */}
        <View className="absolute right-4 bottom-20" style={{ alignItems: "center" }}>
          <View className="items-center mb-6">
            <Image
              source={{ uri: poster }}
              className="w-12 h-12 rounded-full border-2 border-white mb-1"
            />
            <View className="bg-[#f97316] rounded-full p-1 -mt-3">
              <Ionicons name="add" size={12} color="white" />
            </View>
          </View>

          <AnimatedPressable onPress={handleLike} style={heartStyle}>
            <View className="items-center mb-4">
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={35}
                color={isLiked ? "#f97316" : "white"}
              />
              <Text className="text-white text-xs mt-1">{likes}</Text>
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
          <Text className="text-white text-lg font-semibold mb-2">@{username}</Text>
          <Text className="text-white mb-3">{description}</Text>
          <View className="flex-row items-center">
            <Ionicons name="musical-note" size={15} color="white" />
            <Text className="text-white ml-1">{sound}</Text>
          </View>
        </View>

        {/* Play/Pause indicator */}
        {!isPlaying && (
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
