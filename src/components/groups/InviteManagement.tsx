import React, { useState, useEffect } from "react";
import { View, ScrollView, Share, TouchableOpacity, Clipboard } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { InviteConfigModal } from "./InviteConfigModal";
import { useGroupInvites } from "@/hooks/useGroupInvites";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import type { DbGroupInvite, GroupRole } from "@/types/firebase/firestoreTypes";

interface InviteManagementProps {
  groupId: string;
  isAdmin: boolean;
}

export function InviteManagement({ groupId, isAdmin }: InviteManagementProps) {
  const [invites, setInvites] = useState<(DbGroupInvite & { id: string })[]>([]);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const { generateInvite, isLoading } = useGroupInvites();

  // Subscribe to invites
  useEffect(() => {
    const invitesRef = collection(db, `groups/${groupId}/invites`);
    const q = query(
      invitesRef,
      where("expiresAt", ">", Timestamp.now()),
      where("isRevoked", "==", false)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const inviteData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (DbGroupInvite & { id: string })[];

      setInvites(inviteData);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleCreateInvite = async (config: { role: GroupRole; maxUses: number }) => {
    const invite = await generateInvite(groupId, config);
    if (!invite) return;

    const inviteUrl = `kinetik://groups/join?code=${invite.code}`;
    await Share.share({
      message: `Join my group on Kinetik!\n\nUse invite code: ${invite.code}`,
      url: inviteUrl,
    });

    setIsInviteModalVisible(false);
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await updateDoc(doc(db, `groups/${groupId}/invites/${inviteId}`), {
        isRevoked: true,
      });
    } catch (err) {
      console.error("Error revoking invite:", err);
    }
  };

  const formatTimeLeft = (expiresAt: Timestamp) => {
    const now = Date.now();
    const expiry = expiresAt.toMillis();
    const diff = expiry - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Expiring soon";
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
  };

  return (
    <ScrollView>
      <View className="flex-row items-center justify-center gap-x-4 mb-4">
        <Text weight="medium" size="base">
          Active Invites
        </Text>
        <TouchableOpacity
          onPress={() => setIsInviteModalVisible(true)}
          disabled={!isAdmin}
          className="bg-primary p-1 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {invites.length > 0 ? (
        <View className="flex-col gap-y-2">
          {invites.map(invite => (
            <AnimatedContainer
              key={invite.id}
              variant="flat-surface"
              className="p-4 flex-col gap-y-2 border border-orange-500"
            >
              <View className="flex-row items-center justify-around">
                <View className="flex-row items-center gap-x-2">
                  <Text weight="medium" className="text-primary">
                    {invite.code}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCopyCode(invite.code)}
                    className="p-1 rounded-full bg-surface-pressed items-center justify-center"
                  >
                    <Ionicons name="copy-outline" size={14} color="#666" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center gap-x-2">
                  <Text size="sm" intent="muted">
                    {invite.usedCount}/{invite.maxUses} uses
                  </Text>
                  <Text size="sm" intent="muted">
                    •
                  </Text>
                  <Text size="sm" intent="muted">
                    {formatTimeLeft(invite.expiresAt)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-around">
                <View className="flex-row items-center gap-x-1">
                  <Ionicons name="person" size={14} color="#666" />
                  <Text size="sm" intent="muted">
                    {invite.role}
                  </Text>
                </View>
                {isAdmin && (
                  <Button
                    variant="neu-raised"
                    size="sm"
                    textComponent={<Text intent="button-primary">Revoke</Text>}
                    onPress={() => handleRevokeInvite(invite.id)}
                    className="py-1"
                  />
                )}
              </View>
            </AnimatedContainer>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Text intent="muted">No active invites</Text>
        </View>
      )}

      <InviteConfigModal
        isVisible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        onConfirm={handleCreateInvite}
        isLoading={isLoading}
      />
    </ScrollView>
  );
}
