import React, { useCallback, useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { ControlledSelect } from "@/components/ui/ControlledSelect";
import { Tag } from "@/components/ui/Tag";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { VISIBILITY_OPTIONS, MEMBERSHIP_OPTIONS } from "@/lib/constants/groups";
import { useAuth } from "@/hooks/useAuth";
import type { GroupRole } from "@/types/firebase/firestoreTypes";
import type { Group, GroupMember } from "@/hooks/useGroup";

type SelectOption = {
  label: string;
  value: string;
};

const roleOptions: SelectOption[] = [
  { label: "Member", value: "member" },
  { label: "Admin", value: "admin" },
];

interface GroupSettingsProps {
  group: Group | null | undefined;
  members?: GroupMember[];
  isAdmin: boolean;
}

export function GroupSettings({ group, members = [], isAdmin }: GroupSettingsProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"visibility" | "membership" | "role" | null>(
    null
  );
  const [errorState, setError] = useState<string | null>(null);

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

  const handleUpdateVisibility = useCallback(
    async (visibility: string) => {
      if (!group || !isAdmin) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", group.id), {
          visibility,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[GroupManage] Error updating visibility:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, isAdmin]
  );

  const handleUpdateMembership = useCallback(
    async (membership: string) => {
      if (!group || !isAdmin) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", group.id), {
          membership,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[GroupManage] Error updating membership:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, isAdmin]
  );

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, value: string[]) => {
      if (!group || !isAdmin || !value.length) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", group.id, "members", memberId), {
          role: value[0],
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error updating member role:", err);
      } finally {
        setIsUpdating(false);
      }
    },
    [group, isAdmin]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!group || !isAdmin || memberId === user?.uid) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", group.id), {
          memberCount: (group.memberCount || 1) - 1,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error removing member:", err);
      } finally {
        setIsUpdating(false);
      }
    },
    [group, isAdmin, user?.uid]
  );

  const handleUpdateGroupInfo = useCallback(
    async (data: { name?: string; description?: string }) => {
      if (!group || !isAdmin) return;

      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "groups", group.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error updating group info:", err);
        setError(err instanceof Error ? err.message : "Failed to update group");
      } finally {
        setIsUpdating(false);
      }
    },
    [group, isAdmin]
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
    <ScrollView className="flex-1">
      {!group ? (
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
  );
}
