import React from "react";
import { VideoPreview } from "@/components/camera/VideoPreview";
import { useLocalSearchParams, router } from "expo-router";

export default function PreviewScreen() {
  const { videoUri } = useLocalSearchParams<{ videoUri: string }>();

  const handleSave = (uri: string) => {
    router.push({
      pathname: "/(create)/edit",
      params: { videoUri: uri },
    });
  };

  const handleRetake = () => {
    router.back();
  };

  if (!videoUri) {
    return null;
  }

  return <VideoPreview uri={videoUri} onSave={handleSave} onRetake={handleRetake} />;
}
