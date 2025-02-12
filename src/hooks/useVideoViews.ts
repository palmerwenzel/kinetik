import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";

interface VideoViewsDoc {
  viewedVideos: { [videoId: string]: Timestamp };
  lastViewedAt: Timestamp;
}

export function useVideoViews(groupId?: string) {
  const { user } = useAuth();
  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());
  const [lastViewedAt, setLastViewedAt] = useState<Date | null>(null);

  // Load viewed videos for the user
  useEffect(() => {
    if (!user?.uid) return;

    const viewsRef = doc(db, "users", user.uid, "videoViews", "global");
    getDoc(viewsRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as VideoViewsDoc;
        setViewedVideos(new Set(Object.keys(data.viewedVideos)));
        setLastViewedAt(data.lastViewedAt.toDate());
      }
    });
  }, [user?.uid]);

  // Mark a video as viewed
  const markAsViewed = useCallback(
    async (videoId: string) => {
      if (!user?.uid || viewedVideos.has(videoId)) return;

      const viewsRef = doc(db, "users", user.uid, "videoViews", "global");
      const now = Timestamp.now();

      try {
        await setDoc(
          viewsRef,
          {
            viewedVideos: { [videoId]: now },
            lastViewedAt: now,
          },
          { merge: true }
        );

        setViewedVideos(prev => new Set([...prev, videoId]));
        setLastViewedAt(now.toDate());
      } catch (error) {
        console.error("Error marking video as viewed:", error);
      }
    },
    [user?.uid, viewedVideos]
  );

  // Calculate unread count for a list of videos
  const getUnreadCount = useCallback(
    (videos: Array<{ id: string; createdAt: Date }>) => {
      if (!lastViewedAt) return videos.length;
      return videos.filter(video => !viewedVideos.has(video.id)).length;
    },
    [viewedVideos, lastViewedAt]
  );

  return {
    viewedVideos,
    lastViewedAt,
    markAsViewed,
    getUnreadCount,
  };
}
