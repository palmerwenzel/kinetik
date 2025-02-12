import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { GroupRole } from "@/types/firebase/firestoreTypes";

const ROLE_OPTIONS = [
  {
    label: "Viewer",
    value: "viewer" as GroupRole,
    description: "Can only view content",
  },
  {
    label: "Member",
    value: "member" as GroupRole,
    description: "Can view and post content",
  },
  {
    label: "Admin",
    value: "admin" as GroupRole,
    description: "Can manage group settings and members",
  },
] as const;

interface InviteConfigModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (config: { role: GroupRole; maxUses: number }) => void;
  isLoading?: boolean;
}

export function InviteConfigModal({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}: InviteConfigModalProps) {
  const [role, setRole] = useState<GroupRole>("viewer");
  const [maxUses, setMaxUses] = useState("1");

  const handleConfirm = () => {
    const uses = parseInt(maxUses, 10);
    onConfirm({
      role,
      maxUses: !uses || isNaN(uses) ? 1 : uses,
    });
  };

  const selectedRoleDescription = ROLE_OPTIONS.find(option => option.value === role)?.description;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="p-4">
        <Text weight="bold" size="xl" className="text-center mb-6">
          Invite Settings
        </Text>

        {/* Role Selection */}
        <View className="mb-6">
          <View className="flex-row items-baseline mb-2">
            <Text weight="medium" size="base" className="mr-2">
              Role
            </Text>
            <Text size="xs" intent="muted" numberOfLines={1} className="flex-1">
              ({selectedRoleDescription})
            </Text>
          </View>
          <View className="flex-row justify-between">
            {ROLE_OPTIONS.map(option => (
              <View key={option.value} className="w-[31%]">
                <Tag
                  label={option.label}
                  isSelected={role === option.value}
                  onPress={() => setRole(option.value)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Max Uses Input */}
        <View className="mb-8">
          <Input
            variant="neu-surface"
            label="Number of Uses"
            placeholder="Enter max number of uses"
            keyboardType="number-pad"
            defaultValue="1"
            onChangeText={val => {
              const num = val === "" ? "1" : val;
              setMaxUses(num);
            }}
            value={maxUses}
          />
          <Text size="xs" intent="muted" className="mt-2">
            How many times this invite can be used
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-x-4">
          <Button
            variant="neu-pressed"
            textComponent={<Text>Cancel</Text>}
            onPress={onClose}
            isDisabled={isLoading}
            className="flex-1"
          />
          <Button
            variant="neu-accent"
            textComponent={<Text intent="button-accent">Create Invite</Text>}
            onPress={handleConfirm}
            isLoading={isLoading}
            className="flex-1"
          />
        </View>
      </View>
    </Modal>
  );
}
