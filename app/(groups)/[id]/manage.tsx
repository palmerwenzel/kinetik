import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Share,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { useAuth } from "@/hooks/useAuth";
import { useGroup, GroupMember } from "@/hooks/useGroup";
import { Input } from "@/components/ui/Input";
import { ControlledSelect } from "@/components/ui/ControlledSelect";
import { Tag } from "@/components/ui/Tag";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { VISIBILITY_OPTIONS, MEMBERSHIP_OPTIONS } from "@/lib/constants/groups";
import { useGroupInvites } from "@/hooks/useGroupInvites";
import { InviteConfigModal } from "@/components/groups/InviteConfigModal";
import type { GroupRole } from "@/types/firebase/firestoreTypes";

type SelectOption = {
  label: string;
  value: string;
};

const roleOptions: SelectOption[] = [
  { label: "Member", value: "member" },
  { label: "Admin", value: "admin" },
];

export default function GroupManageScreen() {
  const { id } = useLocalSearchParams();
  const groupId = typeof id === "string" ? id : id[0];
  const router = useRouter();
  const { user } = useAuth();
  const { group, members = [], isLoading, error, isAdmin = false } = useGroup(groupId);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"visibility" | "membership" | "role" | null>(
    null
  );
  const [errorState, setError] = useState<string | null>(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  const filteredMembers = members
    ?.sort((a, b) => {
      // Sort by name first
      const nameA = (a.username || "Anonymous").toLowerCase();
      const nameB = (b.username || "Anonymous").toLowerCase();
      if (nameA !== nameB) return nameA.localeCompare(nameB);

      // Then by role (admins first)
      return a.role === "admin" ? -1 : b.role === "admin" ? 1 : 0;
    })
    ?.filter(member => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      const username = (member.username || "Anonymous").toLowerCase();
      return username.includes(searchLower);
    })
    ?.slice(0, 3); // Keep to 3 members for mobile

  const { generateInvite } = useGroupInvites();

  /**
   * PARTIAL UPDATES BELOW
   */

  const handleUpdateVisibility = useCallback(
    async (visibility: string) => {
      console.log("[GroupManage] Attempting partial update for visibility", {
        groupId,
        visibility,
        isAdmin,
        userId: user?.uid,
      });

      if (!group || !isAdmin) {
        console.log("[GroupManage] Update rejected - no group or not admin", {
          hasGroup: !!group,
          isAdmin,
        });
        return;
      }

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", groupId), {
          visibility,
          updatedAt: serverTimestamp(),
        });
        console.log("[GroupManage] Partial update for visibility complete");
      } catch (err) {
        console.error("[GroupManage] Error updating visibility:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, groupId, isAdmin, user?.uid]
  );

  const handleUpdateMembership = useCallback(
    async (membership: string) => {
      console.log("[GroupManage] Attempting partial update for membership", {
        groupId,
        membership,
        isAdmin,
        userId: user?.uid,
      });

      if (!group || !isAdmin) {
        console.log("[GroupManage] Update rejected - no group or not admin");
        return;
      }

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", groupId), {
          membership,
          updatedAt: serverTimestamp(),
        });
        console.log("[GroupManage] Partial update for membership complete");
      } catch (err) {
        console.error("[GroupManage] Error updating membership:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, groupId, isAdmin, user?.uid]
  );

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, value: string[]) => {
      if (!group || !isAdmin || !value.length) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", groupId, "members", memberId), {
          role: value[0],
          updatedAt: serverTimestamp(),
        });
        console.log("[GroupManage] Partial update for member role complete");
      } catch (err) {
        console.error("Error updating member role:", err);
      } finally {
        setIsUpdating(false);
      }
    },
    [group, groupId, isAdmin]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!group || !isAdmin || memberId === user?.uid) return;

      setIsUpdating(true);
      try {
        // Partial update for memberCount only
        await updateDoc(doc(db, "groups", groupId), {
          memberCount: (group.memberCount || 1) - 1,
          updatedAt: serverTimestamp(),
        });
        console.log("[GroupManage] Partial update for removing member complete");
      } catch (err) {
        console.error("Error removing member:", err);
      } finally {
        setIsUpdating(false);
      }
    },
    [group, groupId, isAdmin, user?.uid]
  );

  const handleInviteMember = useCallback(
    async (config: { role: GroupRole; maxUses: number }) => {
      if (!group) return;

      try {
        const invite = await generateInvite(groupId, {
          role: config.role,
          maxUses: config.maxUses,
        });

        if (!invite) {
          console.error("Failed to generate invite");
          return;
        }

        // Create invite URL with code
        const inviteUrl = `kinetik://groups/join?code=${invite.code}`;

        const result = await Share.share({
          message: `Join my group "${group.name}" on Kinetik!\n\nUse invite code: ${invite.code}`,
          url: inviteUrl,
        });

        if (result.action === Share.sharedAction) {
          setIsInviteModalVisible(false);
        }
      } catch (err) {
        console.error("Error sharing group invite:", err);
      }
    },
    [group, groupId, generateInvite]
  );

  const handleUpdateGroupInfo = useCallback(
    async (data: { name?: string; description?: string }) => {
      if (!group || !isAdmin) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", groupId), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        console.log("[GroupManage] Partial update for group info complete");
      } catch (err) {
        console.error("Error updating group info:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, groupId, isAdmin]
  );

  // Debounced name & description
  const [debouncedName, setDebouncedName] = useState(group?.name || "");
  const [debouncedDescription, setDebouncedDescription] = useState(group?.description || "");

  useEffect(() => {
    if (group) {
      setDebouncedName(group.name || "");
      setDebouncedDescription(group.description || "");
    }
  }, [group]);

  // name
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedName !== group?.name) {
        handleUpdateGroupInfo({ name: debouncedName });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedName, group?.name, handleUpdateGroupInfo]);

  // description
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedDescription !== group?.description) {
        handleUpdateGroupInfo({ description: debouncedDescription });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedDescription, group?.description, handleUpdateGroupInfo]);

  if (errorState) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{errorState}</Text>
      </View>
    );
  }

  return (
    <AnimatedContainer variant="flat-surface" className="flex-1">
      {/* Header */}
      <View className="px-4 py-3 border-b border-border/20 dark:border-border-dark/20">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -m-2">
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold flex-1 text-center">Group Settings</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {/* Group Info */}
            <View>
              {/* Name Input */}
              <View className="mb-4">
                <View className="flex-row items-baseline mb-2">
                  <Text weight="medium" size="base" className="mr-2">
                    Name
                  </Text>
                </View>
                <Input
                  variant="neu-surface"
                  placeholder="Enter group name"
                  value={debouncedName}
                  onChangeText={setDebouncedName}
                  isDisabled={!isAdmin || isUpdating}
                />
              </View>

              {/* Description Input */}
              <View className="mb-6">
                <View className="flex-row items-baseline mb-2">
                  <Text weight="medium" size="base" className="mr-2">
                    Description
                  </Text>
                </View>
                <Input
                  variant="neu-surface"
                  placeholder="What's this group about?"
                  value={debouncedDescription}
                  onChangeText={setDebouncedDescription}
                  multiline
                  numberOfLines={4}
                  isDisabled={!isAdmin || isUpdating}
                />
              </View>

              {isAdmin && (
                <>
                  <View className="mb-6">
                    <View className="flex-row items-baseline mb-2">
                      <Text weight="medium" size="base" className="mr-2">
                        Visibility
                      </Text>
                      <Text size="xs" intent="muted" numberOfLines={1} className="flex-1">
                        {`(${
                          VISIBILITY_OPTIONS.find(option => option.value === group?.visibility)
                            ?.description || VISIBILITY_OPTIONS[0].description
                        })`}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      {VISIBILITY_OPTIONS.map(option => (
                        <View key={option.value} className="w-[48%]">
                          <Tag
                            label={option.label}
                            isSelected={group?.visibility === option.value}
                            onPress={() => handleUpdateVisibility(option.value)}
                            isDisabled={isUpdating}
                          />
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className="mb-6">
                    <View className="flex-row items-baseline mb-2">
                      <Text weight="medium" size="base" className="mr-2">
                        Membership
                      </Text>
                      <Text size="xs" intent="muted" numberOfLines={1} className="flex-1">
                        {`(${
                          MEMBERSHIP_OPTIONS.find(option => option.value === group?.membership)
                            ?.description || MEMBERSHIP_OPTIONS[0].description
                        })`}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      {MEMBERSHIP_OPTIONS.map(option => (
                        <View key={option.value} className="w-[48%]">
                          <Tag
                            label={option.label}
                            isSelected={group?.membership === option.value}
                            onPress={() => handleUpdateMembership(option.value)}
                            isDisabled={isUpdating}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Member List */}
            <View>
              <View className="flex-row items-center mb-2">
                <Text weight="medium" size="base" className="mr-2">
                  Members
                </Text>
                <Text size="xs" intent="muted" numberOfLines={1} className="mr-2">
                  ({members?.length} total)
                </Text>
                {(isAdmin || group?.membership === "open") && (
                  <TouchableOpacity
                    onPress={() => setIsInviteModalVisible(true)}
                    disabled={isUpdating}
                    className="bg-primary p-1 rounded-full items-center justify-center mr-2"
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="mb-4"
              />
              {filteredMembers?.length > 0 ? (
                <View className="space-y-2">
                  {filteredMembers.map(member => (
                    <AnimatedContainer
                      key={member.uid}
                      variant="flat-surface"
                      className="flex-row items-center justify-between p-4"
                    >
                      <View className="flex-1">
                        <Text className="font-semibold">{member.username || "Anonymous"}</Text>
                        {member.isActive ? (
                          <Text className="text-text/60 text-sm">Active member</Text>
                        ) : (
                          <Text className="text-text/60 text-sm">Inactive</Text>
                        )}
                      </View>
                      {isAdmin && member.uid !== user?.uid && (
                        <View className="flex-row items-center">
                          <ControlledSelect
                            value={[member.role]}
                            onChange={value => handleUpdateMemberRole(member.uid, value)}
                            options={roleOptions}
                            isOpen={activeDropdown === "role"}
                            onOpenChange={isOpen => setActiveDropdown(isOpen ? "role" : null)}
                            zIndex={30}
                          />
                          <TouchableOpacity
                            onPress={() => handleRemoveMember(member.uid)}
                            className="ml-2 p-2 -m-2"
                          >
                            <Ionicons name="close-circle-outline" size={24} color="red" />
                          </TouchableOpacity>
                        </View>
                      )}
                      {member.uid === user?.uid && <Text className="text-text/60">You</Text>}
                    </AnimatedContainer>
                  ))}
                </View>
              ) : (
                <View className="items-center py-4">
                  <Text intent="muted">No members found</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add the modal */}
      <InviteConfigModal
        isVisible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        onConfirm={handleInviteMember}
        isLoading={isLoading}
      />
    </AnimatedContainer>
  );
}
