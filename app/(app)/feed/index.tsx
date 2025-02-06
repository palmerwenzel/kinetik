import { View } from "react-native";
import { VideoFeed } from "../../../src/components/video/VideoFeed";

const DEMO_VIDEOS = [
  {
    id: "1",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creator: "Demo Creator 1",
  },
  {
    id: "2",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creator: "Demo Creator 2",
  },
  {
    id: "3",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    creator: "Demo Creator 3",
  },
  {
    id: "4",
    uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    creator: "Demo Creator 4",
  },
];

export default function FeedScreen() {
  return (
    <View className="flex-1 bg-black">
      <VideoFeed videos={DEMO_VIDEOS} onEndReached={() => console.log("Reached end of feed")} />
    </View>
  );
}
