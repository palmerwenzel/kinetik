# Phase 1: Authentication & Onboarding

This phase covers the creation of user registration, login, and basic onboarding flows. It aligns with the user flow steps for signing up and setting preferences.

---

## Features & Tasks

- [ ] FRONTEND: Implement Sign Up screen with email/social login options using React Native + NativeBase.  
- [ ] FRONTEND: Add form validation (using React Hook Form or similar) to handle user input errors.  
- [ ] FRONTEND: Style the Sign Up screen according to [@ui-rules.md](../rules/ui-rules.md) and [@theme-rules.md](../rules/theme-rules.md) (Neumorphic design, orange accent buttons).  
- [ ] BACKEND: Integrate Firebase Authentication (email/password, social OAuth if applicable).  
- [ ] BACKEND: Configure user accounts in Firebase (UID-based data structure).
- [ ] FRONTEND: Build Login screen, reusing components from Sign Up for consistency.  
- [ ] FRONTEND: Handle session persistence (React Query or custom hook to re-check token).  
- [ ] BACKEND: Implement secure token checks and re-auth logic with Firebase.  
- [ ] BACKEND: Provide appropriate error messages (e.g., invalid credentials, network issues).
- [ ] FRONTEND: On successful sign-up, route user to profile setup (name, photo, interest tags).  
- [ ] FRONTEND: Validate user input and show interactive progress steps (e.g., name → photo → interests).  
- [ ] BACKEND: Store user profile data in Firestore (or custom user collection).  
- [ ] BACKEND: Set up read/write security rules to protect user data.
- [ ] FRONTEND: Include toggles for default privacy (e.g., “All Public,” “Friends-Only,” or “Group-Only”).  
- [ ] BACKEND: Save privacy preferences in the user’s profile document.  
- [ ] BACKEND: Implement an API endpoint for retrieving and updating user preferences on login.  
- [ ] FRONTEND: Develop a hook/service that calls the API to retrieve and update user preferences on login.
- [ ] FRONTEND: Write Jest + React Native Testing Library tests for form submission and navigation flows.  
- [ ] BACKEND: Use Firebase Emulator to test authentication logic and security rules.  
- [ ] FRONTEND: Verify sign-up → login → onboarding transitions via manual QA and snapshot tests.