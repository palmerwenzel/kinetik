import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import type { DbGroup } from "@/types/firebase/firestoreTypes";

export function useUserGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Array<DbGroup & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Query for groups where the user has any role
    const groupsRef = collection(db, "groups");
    const userGroupsQuery = query(groupsRef, where(`memberRoles.${user.uid}`, "!=", null));

    const unsubscribe = onSnapshot(
      userGroupsQuery,
      snapshot => {
        const groupsData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })) as Array<DbGroup & { id: string }>;

        setGroups(groupsData);
        setIsLoading(false);
      },
      error => {
        console.error("Error fetching groups:", error);
        setError("Failed to load groups");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { groups, isLoading, error };
}
