import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateGroupInput } from "@/types/domain/group";
import { createGroupSchema, type CreateGroupFormData } from "@/schemas/group";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import type { GroupRole, GroupVisibility, GroupMembership } from "@/types/firebase/firestoreTypes";

export type FormData = CreateGroupFormData;

export function useCreateGroupForm() {
  const { user } = useAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      visibility: "public" as GroupVisibility,
      membership: "open" as GroupMembership,
      postingGoal: {
        count: undefined,
        frequency: "day",
        scope: "person",
      },
      category: "",
      settings: {
        allowMemberInvites: true,
        requireAdminApproval: false,
        notificationsEnabled: true,
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      throw new Error("User must be authenticated to create a group");
    }

    try {
      // Create the group document
      const groupsRef = collection(db, "groups");
      const groupDoc = await addDoc(groupsRef, {
        ...data,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberRoles: {
          [user.uid]: "admin" as GroupRole, // Creator is automatically an admin
        },
        memberCount: 1,
        isActive: true,
      });

      // Create initial member document in the members subcollection
      // This stores detailed member info including join date, activity, etc.
      const membersRef = collection(groupDoc, "members");
      await addDoc(membersRef, {
        uid: user.uid,
        role: "admin" as GroupRole,
        joinedAt: serverTimestamp(),
        isActive: true,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
      });

      // Navigate to home screen
      router.replace("/(app)/home");
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
