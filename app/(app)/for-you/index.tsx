import { View } from "react-native";
import { VideoFeed } from "@/components/video/VideoFeed";
import { useIsFocused } from "@react-navigation/native";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useState, useCallback, useEffect } from "react";
import type { DbVideo } from "@/types/firebase/firestoreTypes";
import { useToast } from "@/hooks/useToast";
import { useVideoLikes } from "@/hooks/useVideoLikes";

const VIDEOS_PER_PAGE = 5;

type LastVisibleType = QueryDocumentSnapshot<DbVideo>;
type VideoWithId = DbVideo & { id: string };

export default function ForYouScreen() {
  const isFocused = useIsFocused();
  const [videos, setVideos] = useState<VideoWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<LastVisibleType | null>(null);
  const toast = useToast();
  const { toggleLike } = useVideoLikes();

  const fetchVideos = useCallback(
    async (lastVisible?: LastVisibleType) => {
      try {
        setIsLoading(true);

        let videosQuery = query(
          collection(db, "videos"),
          where("isActive", "==", true),
          where("isProcessed", "==", true),
          orderBy("createdAt", "desc"),
          limit(VIDEOS_PER_PAGE)
        );

        if (lastVisible) {
          videosQuery = query(
            collection(db, "videos"),
            where("isActive", "==", true),
            where("isProcessed", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(VIDEOS_PER_PAGE)
          );
        }

        const snapshot = await getDocs(videosQuery);
        const newLastVisible = snapshot.docs[snapshot.docs.length - 1] as LastVisibleType;

        const newVideos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as VideoWithId[];

        if (lastVisible) {
          // When loading more, ensure no duplicates
          setVideos(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const uniqueNewVideos = newVideos.filter(v => !existingIds.has(v.id));
            return [...prev, ...uniqueNewVideos];
          });
        } else {
          // Initial load
          setVideos(newVideos);
        }

        if (newLastVisible) {
          setLastDoc(newLastVisible);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleEndReached = () => {
    if (!isLoading && lastDoc) {
      fetchVideos(lastDoc);
    }
  };

  const handleLike = useCallback(
    async (videoId: string) => {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;
      await toggleLike(videoId, video.likes);
    },
    [toggleLike, videos]
  );

  return (
    <View className="flex-1 bg-black">
      <VideoFeed
        videos={videos}
        isScreenFocused={isFocused}
        onEndReached={handleEndReached}
        onLike={handleLike}
        onComment={videoId => console.log("Comment on video:", videoId)}
        onShare={videoId => console.log("Shared video:", videoId)}
        isLoading={isLoading}
      />
    </View>
  );
}
