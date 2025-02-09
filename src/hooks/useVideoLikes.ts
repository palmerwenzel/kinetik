import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import {
  doc,
  increment,
  collection,
  deleteDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
  getDoc,
  writeBatch,
} from "firebase/firestore";

export function useVideoLikes() {
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const toast = useToast();

  const checkIfLiked = useCallback(
    async (videoId: string) => {
      if (!user) return false;

      try {
        // Check user's liked videos document
        const userLikesDoc = await getDoc(doc(db, "userLikes", user.uid));
        const hasLiked = userLikesDoc.exists() && userLikesDoc.data().likedVideos?.[videoId];

        if (hasLiked) {
          setLikedVideos(prev => new Set(prev).add(videoId));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking like status:", error);
        return false;
      }
    },
    [user]
  );

  const toggleLike = async (videoId: string, currentLikes: number) => {
    if (!user) {
      toast.error("You must be logged in to like videos");
      return { success: false, likes: currentLikes };
    }

    const isCurrentlyLiked = likedVideos.has(videoId);
    const batch = writeBatch(db);

    // References
    const videoRef = doc(db, "videos", videoId);
    const userLikesRef = doc(db, "userLikes", user.uid);
    const likeId = `${videoId}_${user.uid}`;
    const likeRef = doc(db, "likes", likeId);

    // Optimistic update
    setLikedVideos(prev => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      return next;
    });

    try {
      if (isCurrentlyLiked) {
        // Unlike
        batch.delete(likeRef);
        batch.update(videoRef, {
          likes: increment(-1),
          updatedAt: serverTimestamp(),
        });
        // Remove from user's liked videos
        batch.update(userLikesRef, {
          [`likedVideos.${videoId}`]: deleteDoc,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Like
        batch.set(likeRef, {
          userId: user.uid,
          videoId,
          createdAt: serverTimestamp(),
        });
        batch.update(videoRef, {
          likes: increment(1),
          updatedAt: serverTimestamp(),
        });
        // Add to user's liked videos
        batch.set(
          userLikesRef,
          {
            [`likedVideos.${videoId}`]: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      await batch.commit();

      return {
        success: true,
        likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1,
      };
    } catch (error) {
      // Revert optimistic update on error
      setLikedVideos(prev => {
        const next = new Set(prev);
        if (isCurrentlyLiked) {
          next.add(videoId);
        } else {
          next.delete(videoId);
        }
        return next;
      });
      console.error("Error toggling like:", error);
      toast.error("Failed to update like. Please try again.");
      return { success: false, likes: currentLikes };
    }
  };

  return {
    likedVideos,
    toggleLike,
    checkIfLiked,
  };
}
