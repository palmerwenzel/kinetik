import React from "react";
import { VideoTool } from "@/components/camera/VideoTool";
import { router } from "expo-router";

export default function CameraScreen() {
  console.log("[CameraScreen] Screen mounted");

  const handleRecordingComplete = (uri: string) => {
    console.log("[CameraScreen] Recording complete callback received, URI:", uri);

    try {
      console.log("[CameraScreen] Attempting navigation to preview");
      router.push({
        pathname: "/(create)/preview",
        params: { videoUri: uri },
      });
      console.log("[CameraScreen] Navigation completed");
    } catch (error) {
      console.error("[CameraScreen] Navigation error:", error);
    }
  };

  return <VideoTool onRecordingComplete={handleRecordingComplete} />;
}
