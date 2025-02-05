# Phase 1: Authentication & Onboarding

**Status: COMPLETED** ✅  
_(Testing tasks postponed)_

This phase covers the creation of user registration, login, and basic onboarding flows. It aligns with the user flow steps for signing up and setting preferences.

---

## Features & Tasks

- [x] FRONTEND: Implement Sign Up screen with email login using React Native.
- [-] FRONTEND: Add social login options (postponed).
- [x] FRONTEND: Add form validation using React Hook Form and Zod to handle user input errors.
- [x] FRONTEND: Style the Sign Up screen according to [@ui-rules.md](../rules/ui-rules.md) and [@theme-rules.md](../rules/theme-rules.md) (Neumorphic design, orange accent buttons).
- [x] BACKEND: Integrate Firebase Authentication (email/password).
- [-] BACKEND: Integrate social OAuth (postponed).
- [x] BACKEND: Configure user accounts in Firebase (UID-based data structure).
- [x] FRONTEND: Build Login screen, reusing components from Sign Up for consistency.
- [x] FRONTEND: Handle session persistence using AuthContext.
- [x] BACKEND: Implement secure token checks and re-auth logic with Firebase.
- [x] BACKEND: Provide appropriate error messages (e.g., invalid credentials, network issues).
- [x] FRONTEND: On successful sign-up, route user to profile setup (name, photo, interest tags).
- [x] FRONTEND: Validate user input and show interactive progress steps (e.g., name → photo → interests).
- [x] BACKEND: Store user profile data in Firestore (basic user collection).
- [x] BACKEND: Set up read/write security rules to protect user data.
- [x] BACKEND: Use Firebase Emulator to test authentication logic.
- [x] BACKEND: Set up and test security rules.
- [-] FRONTEND: Write Jest + React Native Testing Library tests for form submission and navigation flows (postponed).
- [-] FRONTEND: Verify sign-up → login → onboarding transitions via manual QA and snapshot tests (postponed).
