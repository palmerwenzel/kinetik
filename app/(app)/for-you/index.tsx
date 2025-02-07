import { View } from "react-native";
import { VideoFeed } from "@/components/video/VideoFeed";
import { useIsFocused } from "@react-navigation/native";

const DEMO_VIDEOS = [
  {
    id: "1",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://picsum.photos/id/237/400/800",
    username: "fitness_pro",
    description: "Morning HIIT workout 🔥 #fitness #workout #motivation",
    sound: "Original Sound - fitness_pro",
    likes: 1234,
    comments: 89,
    shares: 45,
  },
  {
    id: "2",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://picsum.photos/id/238/400/800",
    username: "tech_lifter",
    description: "Coding between sets 💻💪 #programming #fitness #techlife",
    sound: "Lofi Beats - chill_vibes",
    likes: 892,
    comments: 56,
    shares: 23,
  },
  {
    id: "3",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://picsum.photos/id/239/400/800",
    username: "ai_runner",
    description: "Training my AI model while training myself 🤖🏃‍♂️ #AI #running",
    sound: "Synthwave - future_beats",
    likes: 2341,
    comments: 167,
    shares: 89,
  },
  {
    id: "4",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://picsum.photos/id/240/400/800",
    username: "dev_warrior",
    description: "Post-coding gym session 🏋️‍♂️ #developer #fitness #balance",
    sound: "Workout Mix - gym_beats",
    likes: 1567,
    comments: 123,
    shares: 67,
  },
];

export default function ForYouScreen() {
  const isFocused = useIsFocused();

  return (
    <View className="flex-1 bg-black">
      <VideoFeed
        videos={DEMO_VIDEOS}
        isScreenFocused={isFocused}
        onEndReached={() => console.log("Reached end of feed")}
        onLike={videoId => console.log("Liked video:", videoId)}
        onComment={videoId => console.log("Comment on video:", videoId)}
        onShare={videoId => console.log("Shared video:", videoId)}
      />
    </View>
  );
}
