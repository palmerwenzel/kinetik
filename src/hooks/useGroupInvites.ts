import { useState, useCallback } from "react";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./useAuth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  runTransaction,
  increment,
  collectionGroup,
  doc,
} from "firebase/firestore";
import type { DbGroupInvite, GroupRole } from "@/types/firebase/firestoreTypes";

// Generate a secure random string for invite codes
function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

export function useGroupInvites() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvite = useCallback(
    async (
      groupId: string,
      options: {
        maxUses?: number;
        expiresIn?: number; // milliseconds
        role?: GroupRole;
      } = {}
    ) => {
      if (!user) return null;

      setIsLoading(true);
      setError(null);

      try {
        const invite: Omit<DbGroupInvite, "id"> = {
          code: generateInviteCode(),
          groupId,
          invitedBy: user.uid,
          maxUses: options.maxUses || 1,
          usedCount: 0,
          role: options.role || "member",
          createdAt: serverTimestamp() as Timestamp,
          expiresAt: Timestamp.fromMillis(
            Date.now() + (options.expiresIn || 7 * 24 * 60 * 60 * 1000)
          ), // Default 7 days
          isRevoked: false,
        };

        const docRef = await addDoc(collection(db, `groups/${groupId}/invites`), invite);
        return { id: docRef.id, ...invite };
      } catch (err) {
        console.error("Error generating invite:", err);
        setError(err instanceof Error ? err.message : "Failed to generate invite");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const validateAndAcceptInvite = useCallback(
    async (inviteCode: string) => {
      if (!user) return false;

      setIsLoading(true);
      setError(null);

      try {
        // Query for valid invite
        const inviteQuery = query(
          collectionGroup(db, "invites"),
          where("code", "==", inviteCode),
          where("isRevoked", "==", false),
          where("expiresAt", ">", Timestamp.now())
        );

        const inviteSnap = await getDocs(inviteQuery);
        if (inviteSnap.empty) {
          setError("Invalid or expired invite code");
          return false;
        }

        const invite = inviteSnap.docs[0].data() as DbGroupInvite;
        if (invite.usedCount >= invite.maxUses) {
          setError("This invite has been fully used");
          return false;
        }

        // Use transaction to join group and update invite usage
        await runTransaction(db, async transaction => {
          // Update invite usage
          transaction.update(inviteSnap.docs[0].ref, {
            usedCount: increment(1),
          });

          // Add user to group
          const memberRef = doc(db, `groups/${invite.groupId}/members/${user.uid}`);
          transaction.set(memberRef, {
            uid: user.uid,
            role: invite.role,
            joinedAt: serverTimestamp(),
            isActive: true,
            username: user.displayName || null,
            photoURL: user.photoURL || null,
          });

          // Update group member count
          transaction.update(doc(db, `groups/${invite.groupId}`), {
            memberCount: increment(1),
          });
        });

        return true;
      } catch (err) {
        console.error("Error accepting invite:", err);
        setError(err instanceof Error ? err.message : "Failed to accept invite");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    generateInvite,
    validateAndAcceptInvite,
    isLoading,
    error,
  };
}
