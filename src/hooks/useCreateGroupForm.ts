import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateGroupInput } from "@/types/domain/group";
import { createGroupSchema, type CreateGroupFormData } from "@/schemas/group";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, Timestamp, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { router } from "expo-router";
import type { GroupRole, GroupVisibility, GroupMembership } from "@/types/firebase/firestoreTypes";

export type FormData = CreateGroupFormData;

export function useCreateGroupForm() {
  const { user } = useAuth();
  const { getUserProfile } = useUserProfile();
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

  const handleSubmit = async (data: CreateGroupFormData) => {
    if (!user) return;

    try {
      // Get user profile for username
      const profile = await getUserProfile(user.uid);

      // Create the group document
      const groupDoc = await addDoc(collection(db, "groups"), {
        ...data,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberCount: 1,
        isActive: true,
      });

      // Add creator as first member
      await setDoc(doc(db, "groups", groupDoc.id, "members", user.uid), {
        uid: user.uid,
        role: "admin" as GroupRole,
        joinedAt: serverTimestamp(),
        isActive: true,
        username: profile?.username || null,
        photoURL: user.photoURL || null,
      });

      router.push(`/(groups)/${groupDoc.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
