import type { GroupVisibility, GroupMembership } from "@/types/firebase/firestoreTypes";

export const VISIBILITY_OPTIONS = [
  { label: "Public", value: "public" as GroupVisibility, description: "Anyone can see this group" },
  {
    label: "Private",
    value: "private" as GroupVisibility,
    description: "Only members can see this group",
  },
];

export const MEMBERSHIP_OPTIONS = [
  { label: "Open", value: "open" as GroupMembership, description: "Anyone can join" },
  {
    label: "Invite Only",
    value: "invite-only" as GroupMembership,
    description: "Members must be invited to join",
  },
];

export const FREQUENCY_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export const SCOPE_OPTIONS = [
  { label: "Per Person", value: "person", description: "Each member contributes this many posts" },
  {
    label: "Group Total",
    value: "group",
    description: "The group collectively makes this many posts",
  },
];

export const BOOLEAN_OPTIONS = [
  { label: "Enabled", value: "true" },
  { label: "Disabled", value: "false" },
];

export const STEPS = [
  {
    id: "basics",
    title: "Group Basics",
    description: "Let's start with the fundamentals",
  },
  {
    id: "visibility",
    title: "Group Access",
    description: "Who can see and join your group?",
  },
  {
    id: "posting",
    title: "Posting Goals",
    description: "Set expectations for group activity",
  },
  {
    id: "review",
    title: "Review",
    description: "Review your group settings",
  },
] as const;
