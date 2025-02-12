import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: Date;
}

export function useGroupChat(groupId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) return;

    setIsLoading(true);
    const messagesRef = collection(db, "groups", groupId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(100));

    const unsubscribe = onSnapshot(
      messagesQuery,
      snapshot => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as ChatMessage[];

        setMessages(newMessages);
        setIsLoading(false);
      },
      err => {
        console.error("Error fetching messages:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  const sendMessage = async (text: string, userId: string, username: string) => {
    if (!text.trim() || !groupId || !userId) return;

    try {
      const messagesRef = collection(db, "groups", groupId, "messages");
      await addDoc(messagesRef, {
        text: text.trim(),
        userId,
        username,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err as Error);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
