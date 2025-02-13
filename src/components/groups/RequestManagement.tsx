import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useGroupRequests } from "@/hooks/useGroupRequests";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import type { DbGroupRequest } from "@/types/firebase/firestoreTypes";

interface RequestManagementProps {
  groupId: string;
  isAdmin: boolean;
}

export function RequestManagement({ groupId, isAdmin }: RequestManagementProps) {
  const [requests, setRequests] = useState<(DbGroupRequest & { id: string })[]>([]);
  const { handleRequest, isLoading } = useGroupRequests();

  // Subscribe to pending requests
  useEffect(() => {
    const requestsRef = collection(db, `groups/${groupId}/requests`);
    const q = query(requestsRef, where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (DbGroupRequest & { id: string })[];

      setRequests(requestData);
    });

    return () => unsubscribe();
  }, [groupId]);

  const formatTimeAgo = (createdAt: Timestamp) => {
    const now = Date.now();
    const created = createdAt.toMillis();
    const diff = now - created;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <ScrollView>
      <View className="flex-row items-center justify-center mb-4">
        <Text weight="medium" size="base">
          Pending Requests
        </Text>
      </View>

      {requests.length > 0 ? (
        <View className="flex-col gap-y-2">
          {requests.map(request => (
            <AnimatedContainer
              key={request.id}
              variant="flat-surface"
              className="p-4 flex-col gap-y-2"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-2">
                  <Text weight="medium">{request.username || "Anonymous"}</Text>
                  <Text size="sm" intent="muted">
                    {formatTimeAgo(request.createdAt)}
                  </Text>
                </View>
              </View>
              {isAdmin && (
                <View className="flex-row items-center justify-end gap-x-2">
                  <Button
                    variant="neu-pressed"
                    size="sm"
                    textComponent={<Text>Reject</Text>}
                    onPress={() => handleRequest(groupId, request.id, "reject")}
                    isDisabled={isLoading}
                    className="py-1"
                  />
                  <Button
                    variant="neu-accent"
                    size="sm"
                    textComponent={<Text intent="button-accent">Approve</Text>}
                    onPress={() => handleRequest(groupId, request.id, "approve")}
                    isDisabled={isLoading}
                    className="py-1"
                  />
                </View>
              )}
            </AnimatedContainer>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Text intent="muted">No pending requests</Text>
        </View>
      )}
    </ScrollView>
  );
}
