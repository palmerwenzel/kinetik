import { useState, useCallback } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  username: string;
  photoURL?: string;
}

// Cache user profiles to avoid repeated fetches
const profileCache = new Map<string, UserProfile>();

export function useUserProfile() {
  const [loadingProfiles, setLoadingProfiles] = useState(new Set<string>());

  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    // Return from cache if available
    if (profileCache.has(userId)) {
      return profileCache.get(userId)!;
    }

    setLoadingProfiles(prev => new Set(prev).add(userId));

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        return null;
      }

      const profile = {
        username: userDoc.data().username,
        photoURL: userDoc.data().photoURL,
      };

      // Cache the result
      profileCache.set(userId, profile);
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    } finally {
      setLoadingProfiles(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, []);

  return {
    getUserProfile,
    loadingProfiles,
  };
}
