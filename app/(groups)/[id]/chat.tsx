import { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useAuth } from "@/hooks/useAuth";
import { useGroup } from "@/hooks/useGroup";
import { useGroupChat, ChatMessage } from "@/hooks/useGroupChat";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const router = useRouter();
  const { user } = useAuth();
  const { group } = useGroup(groupId);
  const { messages, isLoading, error, sendMessage } = useGroupChat(groupId);
  const [messageText, setMessageText] = useState("");

  // Gesture handling for swipe navigation
  const translateX = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;

  const panGesture = Gesture.Pan()
    .onChange(event => {
      // Only allow right swipe (to go back to videos)
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(event => {
      if (event.translationX > screenWidth * 0.3) {
        translateX.value = withSpring(screenWidth, {}, () => {
          runOnJS(router.back)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSend = useCallback(async () => {
    if (!messageText.trim() || !user) return;

    Keyboard.dismiss();
    await sendMessage(messageText.trim(), user.uid, user.displayName || "Anonymous");
    setMessageText("");
  }, [messageText, user, sendMessage]);

  const renderMessage = useCallback(
    ({ item: message }: { item: ChatMessage }) => {
      const isOwnMessage = message.userId === user?.uid;

      return (
        <View className={`flex-row ${isOwnMessage ? "justify-end" : "justify-start"} mb-4 mx-4`}>
          <View
            className={`${
              isOwnMessage
                ? "bg-primary rounded-t-xl rounded-l-xl"
                : "bg-surface dark:bg-surface-dark rounded-t-xl rounded-r-xl"
            } px-4 py-3 max-w-[80%]`}
          >
            {!isOwnMessage && (
              <Text className="text-text/60 dark:text-text-dark/60 text-sm mb-1">
                {message.username}
              </Text>
            )}
            <Text
              className={`${
                isOwnMessage ? "text-white" : "text-text dark:text-text-dark"
              } text-base`}
            >
              {message.text}
            </Text>
          </View>
        </View>
      );
    },
    [user?.uid]
  );

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error loading messages</Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View className="flex-1" style={animatedStyle}>
        <AnimatedContainer variant="flat-surface" padding="none" className="flex-1">
          {/* Header */}
          <View className="absolute top-3 left-0 right-0 z-10 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.back()} className="p-2 -m-2">
                <Ionicons name="chevron-back" size={28} color="black" />
              </TouchableOpacity>
              <View className="flex-1 max-w-[50%] items-center mx-4">
                <Text numberOfLines={1} className="font-semibold text-lg text-center">
                  {group?.name || "Chat"}
                </Text>
                <Text numberOfLines={1} className="text-text/60 text-sm">
                  {messages.length} messages
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.replace(`/(groups)/${groupId}/dashboard`)}
                className="p-2 -m-2"
              >
                <Ionicons name="settings-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <View className="flex-1 mt-20">
            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <FlatList
                data={messages}
                renderItem={renderMessage}
                inverted
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={item => item.id}
                onScrollBeginDrag={Keyboard.dismiss}
              />
            )}
          </View>

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
          >
            <AnimatedContainer
              variant="neu-inset"
              className="flex-row items-end px-4 py-3 border-t border-border/20 dark:border-border-dark/20"
            >
              <TextInput
                className="flex-1 min-h-[40px] max-h-[120px] px-4 py-2 mr-3 rounded-xl bg-surface dark:bg-surface-dark text-base text-text dark:text-text-dark"
                placeholder="Message..."
                placeholderTextColor="#999"
                value={messageText}
                onChangeText={setMessageText}
                multiline
                style={{ lineHeight: 20 }}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={true}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!messageText.trim()}
                className={`p-2 rounded-full ${
                  messageText.trim() ? "bg-primary" : "bg-primary/50"
                }`}
              >
                <Ionicons name="arrow-up" size={24} color="white" />
              </TouchableOpacity>
            </AnimatedContainer>
          </KeyboardAvoidingView>
        </AnimatedContainer>
      </Animated.View>
    </GestureDetector>
  );
}
