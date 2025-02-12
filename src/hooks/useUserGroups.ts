import { useEffect, useState } from "react";
import { collectionGroup, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";
import type { DbGroup } from "@/types/firebase/firestoreTypes";
import { FirebaseError } from "firebase/app";

type GroupWithId = DbGroup & { id: string };

/**
 * Returns the groups in which the current user is a member.
 * Uses a two-step process:
 * 1. Query members collection group to find all memberships
 * 2. Get group documents for each membership
 */
export function useUserGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user?.uid) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError("");

        // 1) Query the "members" collectionGroup by field "uid"
        const membersQuery = query(
          collectionGroup(db, "members"),
          where("uid", "==", user.uid),
          where("isActive", "==", true)
        );

        const membersSnap = await getDocs(membersQuery);

        // 2) For each doc, get the parent group document
        const groupDocs: GroupWithId[] = [];
        const processedGroupIds = new Set<string>(); // To prevent duplicates

        for (const memberDoc of membersSnap.docs) {
          const parentGroupRef = memberDoc.ref.parent.parent;
          if (!parentGroupRef) continue;

          // Skip if we've already processed this group
          if (processedGroupIds.has(parentGroupRef.id)) continue;

          try {
            const groupSnap = await getDoc(doc(db, "groups", parentGroupRef.id));
            if (groupSnap.exists()) {
              const groupData = groupSnap.data() as DbGroup;
              if (groupData.isActive) {
                groupDocs.push({ id: groupSnap.id, ...groupData });
                processedGroupIds.add(parentGroupRef.id);
              }
            }
          } catch (err) {
            console.error("[useUserGroups] Error fetching group:", {
              groupId: parentGroupRef.id,
              error: err,
            });
            // Continue with other groups even if one fails
          }
        }

        setGroups(groupDocs);
      } catch (error) {
        const message =
          error instanceof FirebaseError ? error.message : "Failed to fetch user groups";
        console.error("[useUserGroups] Error:", error);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.uid]);

  return { groups, isLoading, error };
}
