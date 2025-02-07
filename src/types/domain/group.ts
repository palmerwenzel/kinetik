import type { DbGroup } from "../firebase/firestoreTypes";
import type { Interest } from "@/lib/constants/interests";

export type GroupVisibilityLevel = DbGroup["visibility_level"];
export type PostingFrequency = DbGroup["posting_goal"]["frequency"];
export type PostingScope = DbGroup["posting_goal"]["scope"];
export type GroupMemberRole = DbGroup["members"][string]["role"];
export type GroupInviteStatus = DbGroup["pending_invites"][string]["status"];

export interface PostingGoal {
  count: number;
  frequency: PostingFrequency;
  scope: PostingScope;
}

export interface GroupMember {
  uid: string;
  role: GroupMemberRole;
  joinedAt: Date;
}

export interface GroupInvite {
  uid: string;
  invitedBy: string;
  invitedAt: Date;
  status: GroupInviteStatus;
}

export interface GroupSettings {
  allowMemberInvites: boolean;
  requireAdminApproval: boolean;
  notificationsEnabled: boolean;
}

export interface GroupMetadata extends Omit<DbGroup["metadata"], "last_activity"> {
  lastActivity: Date;
}

export interface Group
  extends Omit<
    DbGroup,
    "created_at" | "members" | "pending_invites" | "metadata" | "interests" | "settings"
  > {
  createdAt: Date;
  members: GroupMember[];
  pendingInvites: GroupInvite[];
  metadata: GroupMetadata;
  interests: Interest[];
  settings: GroupSettings;
}

// Helper type for creating a new group
export interface CreateGroupInput {
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
  postingGoal: PostingGoal;
  interests: string[];
  settings?: Partial<GroupSettings>;
}

// Helper type for updating group settings
export interface UpdateGroupSettingsInput extends Partial<GroupSettings> {
  groupId: string;
}

// Helper type for managing group members
export interface ManageGroupMemberInput {
  groupId: string;
  memberId: string;
  role?: GroupMemberRole;
  action: "add" | "remove" | "update";
}

// Helper type for group invites
export interface GroupInviteInput {
  groupId: string;
  userIds: string[];
}
