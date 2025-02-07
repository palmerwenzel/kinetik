import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  CameraRecordingOptions,
  VideoQuality,
} from "expo-camera";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";

interface VideoRecorderProps {
  /** Callback fired when video recording is completed with the video URI */
  onRecordingComplete: (uri: string) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  const [type, setType] = useState<"front" | "back">("back");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  // Use a ref that always tracks the latest recording status.
  const recordingActive = useRef(false);

  useEffect(() => {
    recordingActive.current = isRecording;
  }, [isRecording]);

  // Timer increment for the UI
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Cleanup only when the component unmounts.
  useEffect(() => {
    return () => {
      if (recordingActive.current) {
        console.log("[VideoRecorder] Cleanup: stopping recording");
        cameraRef.current?.stopRecording();
      }
      console.log("[VideoRecorder] Component unmounted");
    };
  }, []);

  // Request required permissions on mount.
  useEffect(() => {
    (async () => {
      console.log("[VideoRecorder] Requesting permissions");
      const cameraResult = await requestCameraPermission();
      const microphoneResult = await requestMicrophonePermission();
      console.log("[VideoRecorder] Permission request results:", {
        camera: cameraResult.granted,
        microphone: microphoneResult.granted,
      });
    })();
  }, []);

  const hasPermission = cameraPermission?.granted && microphonePermission?.granted;

  if (hasPermission === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4">Camera and microphone access required</Text>
        <TouchableOpacity
          onPress={async () => {
            console.log("[VideoRecorder] Manually requesting permissions");
            await requestCameraPermission();
            await requestMicrophonePermission();
          }}
          className="bg-accent px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // For iOS we might prefer higher quality.
  const videoQuality: VideoQuality = Platform.OS === "ios" ? "1080p" : "720p";

  function toggleCameraType() {
    const nextType = type === "back" ? "front" : "back";
    console.log("[VideoRecorder] Camera type changed to:", nextType);
    setType(nextType);
  }

  /**
   * Handles both start and stop recording.
   *
   * Instead of passing a hard maxDuration to recordAsync (which can lead to the native module interfering
   * with a manual stop), we now rely on manual control. If an auto-stop is desired, a timer is used.
   *
   * Also note that calling stopRecording() is the only way to cause the recordAsync promise to resolve.
   */
  async function handleRecordPress() {
    try {
      if (!isRecording) {
        console.log("[VideoRecorder] Starting recording");
        setIsRecording(true);

        // If you want an auto-stop feature (e.g., after 5 seconds), use a timer:
        const autoStopTimer = setTimeout(() => {
          if (recordingActive.current) {
            console.log("[VideoRecorder] Auto-stopping recording");
            cameraRef.current?.stopRecording();
          }
        }, 5000);

        // Do not pass maxDuration here. Leave options empty to allow manual stopping.
        const options: CameraRecordingOptions = {};
        const result = await cameraRef.current?.recordAsync(options);
        clearTimeout(autoStopTimer);
        setIsRecording(false);

        if (result?.uri) {
          console.log("[VideoRecorder] Recording complete at URI:", result.uri);
          const fileInfo = await FileSystem.getInfoAsync(result.uri);
          console.log("[VideoRecorder] Video file check:", {
            uri: result.uri,
            exists: fileInfo.exists,
          });

          if (!fileInfo.exists) {
            throw new Error("Video file not found at URI");
          }

          onRecordingComplete(result.uri);
        }
      } else {
        console.log("[VideoRecorder] Stop recording");
        cameraRef.current?.stopRecording();
      }
    } catch (error) {
      console.error("[VideoRecorder] Error in handleRecordPress:", error);
      setIsRecording(false);
    }
  }

  function handleClose() {
    if (isRecording) {
      console.log(
        "[VideoRecorder] Recording in progress. Please stop the recording before closing."
      );
      return;
    }
    router.back();
  }

  function handleDebugPress() {
    console.log("[VideoRecorder] Debug: Force navigation");
    const dummyUri = "file://dummy/path/video.mp4";
    console.log("[VideoRecorder] Debug: Using dummy URI:", dummyUri);
    onRecordingComplete(dummyUri);
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        facing={type}
        style={{ flex: 1 }}
        videoStabilizationMode="auto"
        videoQuality={videoQuality}
      >
        <View className="flex-1 bg-transparent">
          {/* Top Controls */}
          <View className="flex-row items-center justify-between px-4 pt-12">
            <TouchableOpacity
              onPress={handleClose}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            {/* Debug Button */}
            <TouchableOpacity
              onPress={handleDebugPress}
              className="bg-yellow-500 px-3 py-1 rounded-lg"
            >
              <Text className="text-white text-sm">Debug: Next</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraType}
              disabled={isRecording}
              className={`w-10 h-10 items-center justify-center ${isRecording ? "opacity-50" : ""}`}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Recording Indicator */}
          {isRecording && (
            <View className="absolute top-20 left-0 right-0 items-center">
              <View className="flex-row items-center space-x-2 px-4 py-2 bg-black/50 rounded-full">
                <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Text className="text-white font-medium">{formatTime(recordingTime)}</Text>
              </View>
            </View>
          )}

          {/* Bottom Controls */}
          <View className="flex-1 justify-end pb-10">
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handleRecordPress}
                className={`w-20 h-20 rounded-full items-center justify-center ${
                  isRecording ? "bg-white border-4 border-red-500" : "border-4 border-white"
                }`}
              >
                <View
                  className={`${
                    isRecording
                      ? "w-8 h-8 rounded-sm bg-red-500"
                      : "w-16 h-16 rounded-full bg-red-500"
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
