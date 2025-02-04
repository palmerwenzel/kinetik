# Phase 0: Project Setup & Environment Configuration

This checklist covers all the initial setup tasks that need to be completed before beginning feature development. These tasks include installing dependencies, setting up development tools, and configuring the environment for a smooth development workflow.

---

## 1. Pre-Setup Prerequisites
- [x] **Verify Node.js & Yarn:**  
  - Ensure that Node.js (LTS recommended) is installed.
  - Install Yarn globally if not already installed.
- [x] **Version Control:**  
  - Ensure Git is installed and configured.
  - Clone the project repository from the remote source.

---

## 2. Environment & Dependency Installation
- [ ] **Install Project Dependencies:**  
  - Run `yarn install` (or `npm install`) to install all dependencies listed in `package.json`.
- [x] **Set Up Project Configuration Files:**  
  - Ensure that `.env` files for development (and testing) are created and populated with necessary environment variables (e.g., Firebase configuration, API keys, etc.).
- [x] **Create a Base Folder Structure:**  
  - Review and adjust the file/folder organization as defined in [Codebase Organization Rules](../rules/codebase-organization-rules.md).

---

## 3. Development Tooling Configuration
- [ ] **Code Quality & Formatting:**  
  - Configure ESLint for TypeScript and React Native by ensuring `.eslintrc.js` is in place.
  - Set up Prettier with a configuration file (`.prettierrc`) to enforce code style.
- [ ] **TypeScript Setup:**  
  - Confirm that `tsconfig.json` exists and is configured for strict mode.
- [ ] **Setup NativeWind & Tailwind Config:**  
  - Ensure that the NativeWind configuration for Tailwind styling in React Native is properly configured.
- [ ] **Local Firebase Setup:**  
  - Initialize Firebase in the project (under `src/lib/firebase`) and verify connectivity to the Firebase Emulator for testing.
- [ ] **Expo Setup:**  
  - Install Expo CLI globally using `npm install -g expo-cli` (or `yarn global add expo-cli`).
  - Verify that Expo configuration exists (check for `app.json` or `app.config.js`).
  - Run `expo start` to launch the development server and use the Expo Go app to test directly on your physical device.

---

## 4. Continuous Integration & Version Control
- [ ] **CI/CD Pipeline Setup:**  
  - Ensure that the automated CI/CD configuration (e.g., GitHub Actions) is in place and passes initial checks.
- [ ] **Initial Commit & Branching Strategy:**  
  - Make an initial commit with the base project setup.
  - Establish a branching strategy (e.g., feature branches from `develop`).

---

## 5. Verification & Documentation
- [ ] **Environment Verification:**  
  - Run the project locally to confirm that the bundler starts without errors.
  - Verify that environment variables and configuration files are correctly loaded.
- [ ] **Update Documentation:**  
  - Confirm that setup instructions are documented in this file and are also cross-referenced in the main project README.

---

By completing these initial setup tasks, the project will be configured with a standardized development environment—including critical Expo configuration for our React Native app—ensuring consistency across development efforts and laying a strong foundation for the building phases that follow.