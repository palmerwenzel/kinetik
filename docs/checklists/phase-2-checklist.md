a# Phase 2: Groups Feature

This phase focuses on creating and managing groups, as described in [user-flow.md]. It includes public, friends-only, and restricted group capabilities.

---

## Features & Tasks

- [ ] FRONTEND: Build Group Creation screen (name, purpose, privacy level, standard posting frequency).
- [ ] FRONTEND: Use React Navigation to integrate the Group Creation flow into the home/dashboard.
- [ ] BACKEND: Create Cloud Functions or Firestore triggers (if needed) to handle new group documents.
- [ ] BACKEND: Store group metadata (name, privacy, etc.) and link with the Creator’s user ID.
- [ ] FRONTEND: Implement group invitations (triggering Firebase push updates or in-app notifications).
- [ ] FRONTEND: Provide a screen to manage members, notifications, and roles (admin/participant/viewer).
- [ ] BACKEND: Add Firestore data structure for group membership, roles, and pending invites.
- [ ] BACKEND: Enforce security rules to ensure only admins can invite or remove members.
- [ ] FRONTEND: Display a list of groups the user is part of on the dashboard.
- [ ] FRONTEND: Provide filtering (public, friends-only, or restricted) in a “Discover Groups” view.
- [ ] BACKEND: Implement queries for discovering relevant groups based on user interests or public visibility.
- [ ] BACKEND: Support real-time updates on new group invites or membership changes.
- [ ] FRONTEND: Apply @ui-rules.md for a mobile-friendly group listing.
- [ ] FRONTEND: Incorporate neumorphic cards from @theme-rules.md for group cells.
- [ ] FRONTEND: Ensure accessible touch targets and proper color contrast in both light and dark modes.
- [ ] FRONTEND: Write snapshot tests for Group Creation screen and membership management flows.
- [ ] BACKEND: Validate group data integrity with Firestore rules and unit tests (if using Cloud Functions).
- [ ] FRONTEND: Conduct manual QA to confirm real-time invite updates and membership changes.
