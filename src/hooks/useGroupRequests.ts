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
  doc,
  updateDoc,
} from "firebase/firestore";
import type { DbGroupRequest } from "@/types/firebase/firestoreTypes";

export function useGroupRequests() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(
    async (groupId: string) => {
      if (!user) return null;

      setIsLoading(true);
      setError(null);

      try {
        // Check if user already has a pending request
        const requestsRef = collection(db, `groups/${groupId}/requests`);
        const existingRequestQuery = query(
          requestsRef,
          where("uid", "==", user.uid),
          where("status", "==", "pending")
        );

        const existingRequestSnap = await getDocs(existingRequestQuery);
        if (!existingRequestSnap.empty) {
          setError("You already have a pending request to join this group");
          return null;
        }

        const request: Omit<DbGroupRequest, "id"> = {
          uid: user.uid,
          groupId,
          status: "pending",
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
          username: user.displayName || null,
          photoURL: user.photoURL || null,
        };

        const docRef = await addDoc(requestsRef, request);
        return { id: docRef.id, ...request };
      } catch (err) {
        console.error("Error creating request:", err);
        setError(err instanceof Error ? err.message : "Failed to create request");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const handleRequest = useCallback(
    async (groupId: string, requestId: string, action: "approve" | "reject") => {
      if (!user) return false;

      setIsLoading(true);
      setError(null);

      try {
        const requestRef = doc(db, `groups/${groupId}/requests/${requestId}`);
        const requestSnap = await getDocs(
          query(collection(db, `groups/${groupId}/requests`), where("id", "==", requestId))
        );

        if (requestSnap.empty) {
          setError("Request not found");
          return false;
        }

        const request = requestSnap.docs[0].data() as DbGroupRequest;

        if (action === "approve") {
          // Use transaction to approve request and add member
          await runTransaction(db, async transaction => {
            // Update request status
            transaction.update(requestRef, {
              status: "approved",
              updatedAt: serverTimestamp(),
            });

            // Add user to group as member
            const memberRef = doc(db, `groups/${groupId}/members/${request.uid}`);
            transaction.set(memberRef, {
              uid: request.uid,
              role: "member",
              joinedAt: serverTimestamp(),
              isActive: true,
              username: request.username,
              photoURL: request.photoURL,
            });

            // Update group member count
            transaction.update(doc(db, `groups/${groupId}`), {
              memberCount: increment(1),
            });
          });
        } else {
          // Just update request status to rejected
          await updateDoc(requestRef, {
            status: "rejected",
            updatedAt: serverTimestamp(),
          });
        }

        return true;
      } catch (err) {
        console.error("Error handling request:", err);
        setError(err instanceof Error ? err.message : "Failed to handle request");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    createRequest,
    handleRequest,
    isLoading,
    error,
  };
}
