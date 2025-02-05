import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

export function useProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    async function checkProfileSetup() {
      if (!user) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        // Check if user has completed all required profile fields
        const isProfileComplete = !!(
          userData?.firstName &&
          userData?.lastName &&
          userData?.photoURL
        );

        if (!isProfileComplete) {
          // Redirect to profile setup if not complete
          router.replace("/(auth)/profileSetup");
        }

        setIsCheckingProfile(false);
      } catch (error) {
        console.error("Error checking profile setup:", error);
        setIsCheckingProfile(false);
      }
    }

    checkProfileSetup();
  }, [user, router]);

  return { isCheckingProfile };
}
