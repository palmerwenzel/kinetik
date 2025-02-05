export interface Interest {
  id: string;
  label: string;
  category: "fitness" | "wellness" | "tech" | "creative" | "outdoor";
}

export const INTERESTS: Interest[] = [
  // Fitness
  { id: "weightlifting", label: "Weightlifting", category: "fitness" },
  { id: "running", label: "Running", category: "fitness" },
  { id: "yoga", label: "Yoga", category: "fitness" },
  { id: "hiit", label: "HIIT", category: "fitness" },
  { id: "cycling", label: "Cycling", category: "fitness" },
  { id: "swimming", label: "Swimming", category: "fitness" },

  // Wellness
  { id: "meditation", label: "Meditation", category: "wellness" },
  { id: "nutrition", label: "Nutrition", category: "wellness" },
  { id: "mindfulness", label: "Mindfulness", category: "wellness" },
  { id: "sleep-health", label: "Sleep Health", category: "wellness" },

  // Tech
  { id: "programming", label: "Programming", category: "tech" },
  { id: "ai-ml", label: "AI & Machine Learning", category: "tech" },
  { id: "web-dev", label: "Web Development", category: "tech" },
  { id: "mobile-dev", label: "Mobile Development", category: "tech" },

  // Creative
  { id: "photography", label: "Photography", category: "creative" },
  { id: "writing", label: "Writing", category: "creative" },
  { id: "music", label: "Music", category: "creative" },
  { id: "art", label: "Art", category: "creative" },

  // Outdoor
  { id: "hiking", label: "Hiking", category: "outdoor" },
  { id: "climbing", label: "Climbing", category: "outdoor" },
  { id: "camping", label: "Camping", category: "outdoor" },
  { id: "surfing", label: "Surfing", category: "outdoor" },
];
