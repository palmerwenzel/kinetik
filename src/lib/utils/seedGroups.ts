import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { GroupVisibility, GroupMembership } from "@/types/firebase/firestoreTypes";

// Helper to get random enum value
function getRandomEnumValue<T extends string>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

// Predefined groups with matching categories
const GROUPS = [
  {
    name: "Daily Fitness Challenge",
    description: "Join us for daily fitness challenges and motivation!",
    category: "fitness",
  },
  {
    name: "Tech Innovators Hub",
    description: "Discussing the latest in tech and innovation",
    category: "tech",
  },
  {
    name: "Mindful Living Circle",
    description: "A space for mindfulness and personal growth",
    category: "wellness",
  },
  {
    name: "Creative Writers Workshop",
    description: "Express yourself through creative writing",
    category: "creative",
  },
  {
    name: "Outdoor Adventure Club",
    description: "Experience the great outdoors together",
    category: "outdoor",
  },
  {
    name: "Web Dev Masters",
    description: "Master web development with peers",
    category: "tech",
  },
  {
    name: "Yoga & Meditation",
    description: "Find your inner peace through yoga",
    category: "wellness",
  },
  {
    name: "Photography Enthusiasts",
    description: "Capture and share beautiful moments",
    category: "creative",
  },
  {
    name: "AI Learning Group",
    description: "Explore the world of artificial intelligence",
    category: "tech",
  },
  {
    name: "Hiking Explorers",
    description: "Discover new trails and adventures",
    category: "outdoor",
  },
  {
    name: "Morning Runners Club",
    description: "Start your day with energizing group runs and training tips!",
    category: "fitness",
  },
  {
    name: "Mobile App Builders",
    description: "Building the next generation of mobile applications together",
    category: "tech",
  },
  {
    name: "Stress Management Circle",
    description: "Learn and practice effective stress management techniques",
    category: "wellness",
  },
  {
    name: "Digital Art Community",
    description: "Create and share digital artwork in a supportive environment",
    category: "creative",
  },
  {
    name: "Rock Climbing Crew",
    description: "From beginner to advanced - scale new heights together",
    category: "outdoor",
  },
  {
    name: "Data Science Network",
    description: "Explore data analysis, visualization, and machine learning",
    category: "tech",
  },
  {
    name: "Healthy Eating Hub",
    description: "Share recipes and tips for maintaining a balanced diet",
    category: "wellness",
  },
  {
    name: "Music Production Lab",
    description: "Create, mix, and master music with fellow producers",
    category: "creative",
  },
  {
    name: "CrossFit Warriors",
    description: "High-intensity workouts and functional fitness challenges",
    category: "fitness",
  },
  {
    name: "Kayaking Adventures",
    description: "Paddle through rivers and lakes with fellow enthusiasts",
    category: "outdoor",
  },
];

export async function seedGroups(userId: string) {
  const groups = GROUPS.map(group => ({
    name: group.name,
    description: group.description,
    category: group.category,
    visibility: getRandomEnumValue<GroupVisibility>(["public", "private"]),
    membership: getRandomEnumValue<GroupMembership>(["open", "invite-only", "closed"]),
    postingGoal: {
      count: Math.floor(Math.random() * 5) + 1,
      frequency: getRandomEnumValue(["day", "week", "month"]),
      scope: getRandomEnumValue(["person", "group"]),
    },
    settings: {
      allowMemberInvites: Math.random() > 0.5,
      requireAdminApproval: Math.random() > 0.5,
      notificationsEnabled: true,
    },
  }));

  for (const groupData of groups) {
    try {
      // Create the group document
      const groupDoc = await addDoc(collection(db, "groups"), {
        ...groupData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberCount: 1,
        isActive: true,
      });

      // Add creator as first member
      await setDoc(doc(db, "groups", groupDoc.id, "members", userId), {
        uid: userId,
        role: "admin",
        joinedAt: serverTimestamp(),
        isActive: true,
      });

      console.log(`Created group: ${groupData.name}`);
    } catch (error) {
      console.error(`Error creating group ${groupData.name}:`, error);
    }
  }
}
