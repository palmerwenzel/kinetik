import { Timestamp } from "firebase/firestore";

// Define role type to ensure consistency
export type GroupRole = "admin" | "member" | "viewer";

// Group visibility determines who can see the group
export type GroupVisibility = "public" | "private";

// Group membership determines how new members can join
export type GroupMembership = "open" | "invite-only" | "closed";

export interface DbGroup {
  // Basic info
  name: string;
  description: string;
  category: string;
  visibility: GroupVisibility;
  membership: GroupMembership;

  // Creation info
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Member management
  memberRoles: {
    [uid: string]: GroupRole;
  };
  memberCount: number;

  // Group settings
  postingGoal: {
    count: number;
    frequency: "day" | "week" | "month";
    scope: "person" | "group";
  };
  settings: {
    allowMemberInvites: boolean;
    requireAdminApproval: boolean;
    notificationsEnabled: boolean;
  };

  isActive: boolean;
}

export interface DbGroupMember {
  uid: string;
  role: GroupRole;
  joinedAt: Timestamp;
  isActive: boolean;
  displayName: string | null;
  photoURL: string | null;
}
