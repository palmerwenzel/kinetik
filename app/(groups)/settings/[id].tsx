import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema, type CreateGroupFormData } from "@/schemas/group";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { INTERESTS } from "@/lib/constants/interests";
import { useGroup } from "@/hooks/useGroup";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  VISIBILITY_OPTIONS,
  MEMBERSHIP_OPTIONS,
  FREQUENCY_OPTIONS,
  SCOPE_OPTIONS,
  BOOLEAN_OPTIONS,
} from "@/lib/constants/groups";

type FormData = CreateGroupFormData;

export default function GroupSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { group, isLoading, error } = useGroup(id);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createGroupSchema),
  });

  // Initialize form with group data
  React.useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description,
        category: group.category,
        visibility: group.visibility,
        membership: group.membership,
        postingGoal: group.postingGoal,
        settings: group.settings,
      });
    }
  }, [group, form]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const groupRef = doc(db, "groups", id);
      await updateDoc(groupRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating group:", error);
      setSaveError("Failed to update group settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingSpinner />
      </View>
    );
  }

  if (error || !group) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text intent="error" className="text-center mb-4">
          {error || "Group not found"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-surface-dark">
      <AnimatedContainer variant="flat-surface" className="flex-1 p-4">
        <View className="space-y-6">
          {/* Basic Info */}
          <View>
            <Text weight="medium" size="lg" className="mb-4">
              Basic Information
            </Text>
            <View className="space-y-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    variant="neu-surface"
                    label="Group Name"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    variant="neu-surface"
                    label="Description"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="category"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Category"
                    options={INTERESTS.map(interest => ({
                      label: interest.label,
                      value: interest.id,
                    }))}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    searchable
                  />
                )}
              />
            </View>
          </View>

          {/* Access Settings */}
          <View>
            <Text weight="medium" size="lg" className="mb-4">
              Access Settings
            </Text>
            <View className="space-y-4">
              <Controller
                control={form.control}
                name="visibility"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Visibility"
                    options={VISIBILITY_OPTIONS}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="membership"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Membership"
                    options={MEMBERSHIP_OPTIONS}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Posting Goals */}
          <View>
            <Text weight="medium" size="lg" className="mb-4">
              Posting Goals
            </Text>
            <View className="space-y-4">
              <Controller
                control={form.control}
                name="postingGoal.count"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    variant="neu-surface"
                    label="Posts"
                    keyboardType="number-pad"
                    value={value?.toString()}
                    onChangeText={val => {
                      const num = val === "" ? undefined : parseInt(val, 10);
                      onChange(!num || isNaN(num) ? undefined : num);
                    }}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="postingGoal.frequency"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Frequency"
                    options={FREQUENCY_OPTIONS}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="postingGoal.scope"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Scope"
                    options={SCOPE_OPTIONS}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Additional Settings */}
          <View>
            <Text weight="medium" size="lg" className="mb-4">
              Additional Settings
            </Text>
            <View className="space-y-4">
              <Controller
                control={form.control}
                name="settings.allowMemberInvites"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Member Invites"
                    options={BOOLEAN_OPTIONS}
                    value={value ? "true" : "false"}
                    onChange={val => onChange(val === "true")}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="settings.requireAdminApproval"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Admin Approval"
                    options={BOOLEAN_OPTIONS}
                    value={value ? "true" : "false"}
                    onChange={val => onChange(val === "true")}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="settings.notificationsEnabled"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    variant="neu-surface"
                    label="Notifications"
                    options={BOOLEAN_OPTIONS}
                    value={value ? "true" : "false"}
                    onChange={val => onChange(val === "true")}
                    error={error?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Save Button */}
          <View className="pt-4">
            {saveError && (
              <Text intent="error" className="text-center mb-4">
                {saveError}
              </Text>
            )}
            <Button
              variant="neu-accent"
              textComponent={<Text intent="button-accent">Save Changes</Text>}
              onPress={form.handleSubmit(onSubmit)}
              isLoading={isSaving}
              className="w-full"
            />
          </View>
        </View>
      </AnimatedContainer>
    </ScrollView>
  );
}
