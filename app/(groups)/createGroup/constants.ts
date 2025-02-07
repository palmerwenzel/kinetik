import { z } from "zod";
import type { GroupVisibility, GroupMembership } from "@/types/firebase/firestoreTypes";

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

export type Step = (typeof STEPS)[number]["id"];

// Validation schemas for each step
export const basicsSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .transform(val => val || ""), // Transform undefined/null to empty string
  category: z.string().min(1, "Please select a category"),
});

export const visibilitySchema = z.object({
  visibility: z.enum(["public", "private"] as const, {
    required_error: "Please select who can see your group",
  }),
  membership: z.enum(["open", "invite-only", "closed"] as const, {
    required_error: "Please select how members can join",
  }),
});

export const postingSchema = z.object({
  postingGoal: z.object({
    count: z.number().min(1, "Must post at least once").max(100, "Maximum 100 posts"),
    frequency: z.enum(["day", "week", "month"], {
      required_error: "Please select a frequency",
    }),
    scope: z.enum(["person", "group"], {
      required_error: "Please select how posts are counted",
    }),
  }),
});

// Combined schema for the entire form
export const createGroupSchema = z.object({
  ...basicsSchema.shape,
  ...visibilitySchema.shape,
  ...postingSchema.shape,
});
