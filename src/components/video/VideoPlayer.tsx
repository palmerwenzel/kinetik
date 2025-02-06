import { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
  onLoadStart?: () => void;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");

export function VideoPlayer({ uri, isActive, onLoadStart, onLoad, onError }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(true);
  const wasActive = useRef(isActive);

  // Handle cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (videoRef.current) {
        try {
          videoRef.current.stopAsync();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    };
  }, []);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded || !isMounted.current) return;

    if (status.didJustFinish) {
      try {
        videoRef.current?.replayAsync();
      } catch (error) {
        console.error("Replay error:", error);
      }
    }
  }, []);

  // Handle playback state changes
  useEffect(() => {
    if (!isReady || !videoRef.current || !isMounted.current) return;

    const updatePlaybackStatus = async () => {
      try {
        if (isActive) {
          // If becoming active, seek to start and play
          if (!wasActive.current) {
            await videoRef.current?.setPositionAsync(0);
          }
          await videoRef.current?.playAsync();
        } else {
          // If becoming inactive, pause and seek to start
          await videoRef.current?.pauseAsync();
          await videoRef.current?.setPositionAsync(0);
        }
        wasActive.current = isActive;
      } catch (error) {
        // Only log error if component is still mounted
        if (isMounted.current) {
          console.error("Playback status update error:", error);
        }
      }
    };

    updatePlaybackStatus();
  }, [isActive, isReady]);

  const handleLoad = async () => {
    if (!isMounted.current) return;

    try {
      // Ensure video is at the start
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(0);
      }
      setIsLoading(false);
      setIsReady(true);
      onLoad?.();
    } catch (error) {
      console.error("Load handling error:", error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={false} // Let our effect handle playback
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoadStart={() => {
          if (!isMounted.current) return;
          setIsLoading(true);
          onLoadStart?.();
        }}
        onLoad={handleLoad}
        onError={error => {
          if (!isMounted.current) return;
          console.error("Video load error:", { uri, isActive, error });
          onError?.("Failed to load video");
        }}
        isMuted={false}
        usePoster
        posterStyle={{ width: "100%", height: "100%" }}
      />

      {isLoading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
}
