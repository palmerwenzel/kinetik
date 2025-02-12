import { useEffect, useState } from "react";
import { doc, collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";
import type { DbGroup } from "@/types/firebase/firestoreTypes";

export interface GroupMember {
  uid: string;
  username: string | null;
  photoURL: string | null;
  role: string;
  isActive: boolean;
  joinedAt: Date;
}

export interface Group extends Omit<DbGroup, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Hook to fetch and subscribe to a group's data and its members.
 * Access is controlled by Firestore rules:
 * - Public groups are readable by anyone
 * - Private groups require membership
 * - Group creators always have access
 */
export function useGroup(groupId: string) {
  const [group, setGroup] = useState<Group | undefined>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!groupId || !user?.uid) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    const groupRef = doc(db, "groups", groupId);
    const membersRef = collection(groupRef, "members");

    // Subscribe to both group and members data
    const unsubscribeGroup = onSnapshot(
      groupRef,
      doc => {
        if (!doc.exists()) {
          setError("Group not found");
          setIsLoading(false);
          return;
        }

        setGroup({
          id: doc.id,
          ...(doc.data() as DbGroup),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
        setIsLoading(false);
      },
      error => {
        console.error("[useGroup] Error:", error);
        if (error.code === "permission-denied") {
          setError("Missing or insufficient permissions.");
        } else {
          setError("Error fetching group");
        }
        setIsLoading(false);
      }
    );

    const unsubscribeMembers = onSnapshot(
      query(membersRef),
      snapshot => {
        const membersList = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          joinedAt: doc.data().joinedAt?.toDate(),
        })) as GroupMember[];
        setMembers(membersList);
      },
      error => {
        console.error("[useGroup] Members error:", error);
        // Don't set error here as it might override the group permission error
      }
    );

    return () => {
      unsubscribeGroup();
      unsubscribeMembers();
    };
  }, [groupId, user?.uid]);

  const isMember = members.some(member => member.uid === user?.uid);
  const isAdmin = members.some(member => member.uid === user?.uid && member.role === "admin");

  return {
    group,
    members,
    isLoading,
    error,
    isAdmin,
    isMember,
  };
}
