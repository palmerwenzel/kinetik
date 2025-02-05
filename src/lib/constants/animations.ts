/**
 * Animation presets for consistent motion across the app
 */

export const ANIMATION_PRESETS = {
  // Screen-level animations
  screen: {
    duration: 800,
    initialOffsetY: 0,
  },

  // Content animations
  content: {
    duration: 600,
    initialOffsetY: 30,
    delays: {
      immediate: 0,
      header: 200,
      content: 400,
      actions: 600,
      footer: 800,
    },
  },

  // Micro-interactions
  micro: {
    duration: 300,
    initialOffsetY: 15,
  },
} as const;

// Helper type for animation delays
export type AnimationDelay = keyof typeof ANIMATION_PRESETS.content.delays;

/**
 * Get animation delay based on content type
 */
export function getAnimationDelay(type: AnimationDelay): number {
  return ANIMATION_PRESETS.content.delays[type];
}
