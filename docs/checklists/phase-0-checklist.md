# Phase 0: Project Setup & Environment Configuration

This checklist covers all the initial setup tasks that need to be completed before beginning feature development. These tasks include installing dependencies, setting up development tools, and configuring the environment for a smooth development workflow.

---

## 1. Pre-Setup Prerequisites

- [x] **Verify Node.js:**
  - Ensure that Node.js (LTS recommended) is installed.
- [x] **Version Control:**
  - Ensure Git is installed and configured.
  - Clone the project repository from the remote source.

---

## 2. Environment & Dependency Installation

- [x] **Install Project Dependencies:**
  - Run `npm install` to install all dependencies listed in `package.json`.
- [x] **Set Up Project Configuration Files:**
  - Ensure that `.env` files for development (and testing) are created and populated with necessary environment variables (e.g., Firebase configuration, API keys, etc.).
- [x] **Create a Base Folder Structure:**
  - Review and adjust the file/folder organization as defined in [Codebase Organization Rules](../rules/codebase-organization-rules.md).

---

## 3. Development Tooling Configuration

- [x] **Code Quality & Formatting:**
  - Configure ESLint for TypeScript and React Native by ensuring `.eslintrc.js` is in place.
  - Set up Prettier with a configuration file (`.prettierrc`) to enforce code style.
- [x] **TypeScript Setup:**
  - Confirm that `tsconfig.json` exists and is configured for strict mode.
- [x] **Setup NativeWind & Tailwind Config:**
  - Ensure that the NativeWind configuration for Tailwind styling in React Native is properly configured.
- [x] **Local Firebase Setup:**
  - Initialize Firebase in the project (under `src/lib/firebase`) and verify connectivity to the Firebase Emulator for testing.
- [x] **Expo Setup:**
  - Run `npx expo start` to launch the development server and use the Expo Go app to test directly on your physical device.
- [x] **Testing Infrastructure:**
  - Configure Jest with React Native Testing Library
  - Set up test utilities and helpers
  - Create sample tests to verify setup

---

## 4. Version Control & Documentation

- [x] **Initial Commit**
  - Make an initial commit with the base project setup.
- [ ] **Update Documentation:**
  - Update setup instructions in README
  - Document development workflow
  - Add environment setup guide

Note: CI/CD Pipeline setup moved to Phase 1 to prioritize core feature development for initial launch.

---

## 5. Verification & Documentation

- [x] **Environment Verification:**
  - Run the project locally to confirm that the bundler starts without errors.
  - Verify that environment variables and configuration files are correctly loaded.
- [x] **Update Documentation:**
  - Confirm that setup instructions are documented in this file and are also cross-referenced in the main project README.

---

By completing these initial setup tasks, the project will be configured with a standardized development environment—including critical Expo configuration for our React Native app—ensuring consistency across development efforts and laying a strong foundation for the building phases that follow.
