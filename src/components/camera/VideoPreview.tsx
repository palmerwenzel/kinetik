import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { VideoPublish } from "./VideoPublish";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface VideoPreviewProps {
  uri: string;
  onRetake: () => void;
}

export function VideoPreview({ uri, onRetake }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);

  const videoRef = useRef<Video>(null);

  const togglePlayback = async () => {
    setIsPlaying(prev => !prev);
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  useEffect(() => {
    console.log("[VideoPreview] Mounting with URI:", uri);
    return () => {
      console.log("[VideoPreview] Unmounting");
    };
  }, [uri]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log("[VideoPreview] Playback status update:", status);

    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setError(null);
    } else {
      console.log("[VideoPreview] Video not loaded:", status);
      if (status.error) {
        setError(status.error);
      }
    }
  };

  const handleError = (error: string) => {
    console.error("[VideoPreview] Video error:", error);
    setError(error);
    setIsLoading(false);
  };

  if (showPublish) {
    return <VideoPublish uri={uri} onCancel={() => setShowPublish(false)} />;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <Video
          ref={videoRef}
          source={{ uri }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={handleError}
          style={{ flex: 1, backgroundColor: "black" }}
          useNativeControls={true}
        />

        {isLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <LoadingSpinner />
          </View>
        )}

        {error && (
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-error text-center mb-2">Error loading video:</Text>
            <Text className="text-error text-center">{error}</Text>
          </View>
        )}

        <TouchableOpacity
          className="absolute inset-0 items-center justify-center"
          onPress={() => {
            togglePlayback();
          }}
        >
          {!isPlaying && !isLoading && !error && (
            <View className="w-20 h-20 rounded-full bg-black/50 items-center justify-center">
              <Ionicons name="play" size={36} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="p-4 flex-row justify-between items-center bg-background">
        <Button variant="neu-raised" onPress={onRetake} className="flex-1 mr-2">
          <View className="flex-row items-center justify-center">
            <Ionicons name="camera-reverse" size={24} color="white" className="mr-2" />
            <Text className="text-white ml-2">Retake</Text>
          </View>
        </Button>

        <Button variant="neu-accent" onPress={() => setShowPublish(true)} className="flex-1 ml-2">
          <View className="flex-row items-center justify-center">
            <Text className="text-white mr-2">Next</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>
        </Button>
      </View>
    </View>
  );
}
