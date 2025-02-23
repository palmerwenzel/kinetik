# Phase 1.5: Video Feed MVP

This emergency phase implements core video viewing features to create an engaging demo. It focuses on a TikTok-style interface for seamless video consumption before implementing the full group functionality.

---

## Features & Tasks

### Navigation & Structure

- [x] FRONTEND: Implement bottom tab navigation with Home, Feed, Create, and Profile tabs.
- [x] FRONTEND: Set up navigation container and route configuration using Expo Router.
- [x] FRONTEND: Create Home screen with daily overview and quick actions.
- [x] FRONTEND: Create Feed screen for TikTok-style video viewing.
- [x] FRONTEND: Create minimal Create screen for video upload.
- [ ] FRONTEND: Create Profile screen showing basic user info and activity.
- [x] FRONTEND: Apply neumorphic styling to navigation bar following [@theme-rules.md](../rules/theme-rules.md).

### Video Feed Core

- [x] FRONTEND: Build full-screen video feed container with vertical swipe navigation.
- [x] FRONTEND: Implement video player component with autoplay/pause on swipe.
- [x] FRONTEND: Add loading states and video thumbnails for better UX.
- [x] FRONTEND: Create engagement buttons (like, share) with neumorphic design.
- [x] BACKEND: Set up Firebase Storage structure for video content.
- [ ] BACKEND: Create Firestore collection for video metadata (creator, timestamp, likes).

### Video Playback

- [x] FRONTEND: Integrate Expo AV for video playback control.
- [x] FRONTEND: Implement video preloading for smooth transitions.
- [x] FRONTEND: Add play/pause on tap functionality.
- [x] FRONTEND: Handle video buffering states with loading indicators.
- [x] FRONTEND: Implement video sound control with mute/unmute.
- [x] FRONTEND: Add progress bar for video timeline.

### Performance & UX

- [ ] FRONTEND: Implement video view recycling for memory efficiency.
- [ ] FRONTEND: Add pull-to-refresh for new content.
- [ ] FRONTEND: Create smooth animations for video transitions.
- [ ] FRONTEND: Handle offline state and video caching.
- [ ] BACKEND: Optimize video delivery with proper compression.
- [ ] BACKEND: Implement pagination for feed content.

### Upload Flow (Basic)

- [ ] FRONTEND: Create simple video upload screen with file picker.
- [ ] FRONTEND: Add upload progress indicator.
- [ ] FRONTEND: Implement basic error handling for uploads.
- [ ] BACKEND: Set up Firebase Storage upload endpoint.
- [ ] BACKEND: Create Firestore triggers for video processing.

### Testing & Polish

- [ ] FRONTEND: Test video playback on iOS devices.
- [ ] FRONTEND: Verify smooth scrolling and transitions.
- [ ] FRONTEND: Ensure proper memory management.
- [ ] BACKEND: Validate video upload and retrieval flow.
- [ ] BACKEND: Test feed pagination performance.

---

**Note**: This MVP phase focuses on core video viewing functionality to create an engaging demo. Full social features (comments, sharing) will be implemented in later phases.
