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

export interface DbVideo {
  // Basic info
  caption: string;
  interests: string[];
  groups: string[];

  // Media URLs (from Firebase Storage)
  videoUrl: string;
  thumbnailUrl: string;

  // Video metadata
  duration: number;
  size: number;

  // Creator info
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Engagement metrics
  likes: number;
  comments: number;
  shares: number;

  // Status
  isActive: boolean;
  isProcessed: boolean;
  processingError?: string;
}

export interface DbVideoComment {
  videoId: string;
  text: string;
  createdBy: string;
  createdAt: Timestamp;
  likes: number;
  isActive: boolean;
}

export interface DbVideoLike {
  videoId: string;
  userId: string;
  createdAt: Timestamp;
}
