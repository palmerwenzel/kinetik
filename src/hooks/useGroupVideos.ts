import { useCallback, useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import type { DbVideo } from "@/types/firebase/firestoreTypes";
import { db } from "@/lib/firebase/config";

const VIDEOS_PER_PAGE = 10;

export function useGroupVideos(groupId: string) {
  const [videos, setVideos] = useState<Array<DbVideo & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const fetchVideos = useCallback(
    async (isInitial = false) => {
      try {
        setError(null);
        if (isInitial) setIsLoading(true);

        const videosRef = collection(db, "videos");
        let videoQuery = query(
          videosRef,
          where("groups", "array-contains", groupId),
          where("isActive", "==", true),
          where("isProcessed", "==", true),
          orderBy("createdAt", "desc"),
          limit(VIDEOS_PER_PAGE)
        );

        if (!isInitial && lastDoc) {
          videoQuery = query(
            videosRef,
            where("groups", "array-contains", groupId),
            where("isActive", "==", true),
            where("isProcessed", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(VIDEOS_PER_PAGE)
          );
        }

        const snapshot = await getDocs(videoQuery);
        const newVideos = snapshot.docs.map(doc => ({
          ...(doc.data() as DbVideo),
          id: doc.id,
        }));

        if (isInitial) {
          setVideos(newVideos);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
        }

        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === VIDEOS_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, lastDoc]
  );

  const refresh = useCallback(() => {
    setLastDoc(null);
    return fetchVideos(true);
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos(true);
  }, [fetchVideos]);

  return {
    videos,
    isLoading,
    error,
    hasMore,
    loadMore: () => fetchVideos(false),
    refresh,
  };
}
