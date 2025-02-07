import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const RECORDING_DURATION = 5; // seconds

interface VideoToolProps {
  onRecordingComplete: (uri: string) => void;
}

export function VideoTool({ onRecordingComplete }: VideoToolProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  const cameraRef = useRef<CameraView>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      console.log("[VideoTool] Requesting permissions");
      const camResult = await requestCameraPermission();
      const micResult = await requestMicPermission();
      console.log("[VideoTool] Permission results:", {
        camera: camResult.granted,
        microphone: micResult.granted,
      });
    })();
  }, []);

  // Handle recording progress
  useEffect(() => {
    if (!isRecording) return;

    console.log("[VideoTool] Starting progress tracking");

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / RECORDING_DURATION / 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval.current);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Auto-stop after RECORDING_DURATION
    const stopTimeout = setTimeout(() => {
      console.log("[VideoTool] Auto-stop timeout triggered");
      if (isRecording) {
        stopRecording();
      }
    }, RECORDING_DURATION * 1000);

    return () => {
      console.log("[VideoTool] Cleaning up recording timers");
      clearInterval(progressInterval.current);
      clearTimeout(stopTimeout);
    };
  }, [isRecording]);

  // Add debug logging for camera ref changes
  useEffect(() => {
    if (cameraRef.current) {
      console.log(
        "[VideoTool] Camera ref methods available:",
        Object.getOwnPropertyNames(cameraRef.current)
      );
      console.log(
        "[VideoTool] Camera ref prototype methods:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(cameraRef.current))
      );
    }
  }, [cameraRef.current]);

  const handleMountError = (error: { message: string }) => {
    console.error("[VideoTool] Camera mount error:", error.message);
  };

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.error("[VideoTool] No camera ref available");
      return;
    }

    try {
      console.log("[VideoTool] Starting recording");
      setIsRecording(true);
      setProgress(0);

      const options = {
        maxDuration: RECORDING_DURATION,
        quality: Platform.OS === "ios" ? "1080p" : "720p",
        mute: false,
      };

      console.log("[VideoTool] Recording options:", options);
      console.log("[VideoTool] Camera ref available:", !!cameraRef.current);
      console.log("[VideoTool] Camera ref methods:", Object.keys(cameraRef.current));

      // Start recording
      const recordPromise = cameraRef.current.recordAsync(options);
      console.log("[VideoTool] Recording started, waiting for completion");

      const result = await recordPromise;
      console.log("[VideoTool] Recording completed with result:", JSON.stringify(result));

      if (result?.uri) {
        console.log("[VideoTool] Got valid URI, calling completion handler");
        onRecordingComplete(result.uri);
      } else {
        console.error("[VideoTool] No URI in recording result");
      }
    } catch (error) {
      console.error("[VideoTool] Recording error:", error);
    } finally {
      setIsRecording(false);
      setProgress(0);
    }
  };

  const stopRecording = async () => {
    console.log("[VideoTool] Stopping recording");
    if (isRecording && cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
        console.log("[VideoTool] Stop recording called successfully");
      } catch (error) {
        console.error("[VideoTool] Error stopping recording:", error);
      }
      setIsRecording(false);
      setProgress(0);
    }
  };

  const toggleFacing = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  if (!cameraPermission?.granted || !micPermission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white mb-4">Camera and microphone access required</Text>
        <TouchableOpacity
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
          }}
          className="bg-accent px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        facing={facing}
        style={{ flex: 1 }}
        videoStabilizationMode="auto"
        mode="video"
        onCameraReady={() => console.log("[VideoTool] Camera ready")}
        onMountError={handleMountError}
      >
        {/* Top Controls */}
        <View className="flex-row items-center justify-between px-4 pt-12">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFacing}
            disabled={isRecording}
            className={`w-10 h-10 items-center justify-center ${isRecording ? "opacity-50" : ""}`}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Recording Progress */}
        {isRecording && (
          <View className="absolute top-24 left-4 right-4">
            <View className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <View className="h-full bg-red-500 rounded-full" style={{ width: `${progress}%` }} />
            </View>
            <Text className="text-white text-center mt-2">
              Recording... {Math.ceil((RECORDING_DURATION * (100 - progress)) / 100)}s
            </Text>
          </View>
        )}

        {/* Record Button */}
        <View className="flex-1 justify-end pb-10">
          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
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
      </CameraView>
    </View>
  );
}
