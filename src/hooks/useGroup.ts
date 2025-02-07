import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { DbGroup } from "@/types/firebase/firestoreTypes";

export function useGroup(id: string | undefined) {
  const [group, setGroup] = useState<DbGroup & { id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setGroup(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, "groups", id),
      doc => {
        if (doc.exists()) {
          setGroup({ id: doc.id, ...doc.data() } as DbGroup & { id: string });
        } else {
          setGroup(undefined);
          setError("Group not found");
        }
        setIsLoading(false);
      },
      error => {
        console.error("Error fetching group:", error);
        setError("Failed to load group");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { group, isLoading, error };
}
