# Codebase Organization Rules

This document outlines the recommended folder layout, file naming conventions, modular organization, and documentation practices for the Kinetik project. It is designed to work with our modern tech stack, which is based on **TypeScript**, **React Native**, **React Query + Context**, **React Navigation**, **NativeBase**, **NativeWind**, and **Firebase**. By following these guidelines, we ensure that our codebase remains scalable, maintainable, and consistent.

---

## 1. Folder Structure & Naming

### Directory Layout

Organize the codebase by feature and domain. Below is a recommended directory structure for our modern Expo project:

```
my-app/
├── app/                   // File-based routing with Expo Router
│   ├── _layout.tsx        // Global layout and route configuration
│   ├── index.tsx          // Home screen route
│   ├── Auth/              // Authentication routes
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── Feed/              // Feed routes
│   │   └── FeedScreen.tsx
│   ├── Groups/            // Groups routes
│   │   └── GroupsScreen.tsx
│   └── Profile/           // Profile routes
│       └── ProfileScreen.tsx
├── src/                   // Shared business logic and assets
│   ├── assets/            // Images, fonts, and other static assets
│   ├── components/        // Reusable UI components (e.g., generic Button, Card)
│   ├── hooks/             // Custom hooks (e.g., useAuth, useFetchData)
│   ├── lib/               // Firebase configuration, initialization, and helper functions
│   ├── styles/            // Global styles and NativeWind configuration
│   ├── types/             // TypeScript type declarations and interfaces
│   └── utils/             // Utility functions and helpers
├── tests/                 // Unit and integration tests, mirroring the src structure
├── docs/                  // Documentation and guidelines
├── .eslintrc.js           // ESLint configuration
├── tsconfig.json          // TypeScript configuration
└── package.json
```

This structure leverages the new Expo Router conventions by using the `app/` directory for all routes and screen components, while keeping shared logic, reusable components, and assets in a separate `src/` directory. This approach helps in maintaining a clear separation between view definitions and business logic.

### File Naming Conventions

- **Components & Screens:**  
  Use PascalCase (e.g., `UserProfile.tsx`, `LoginScreen.tsx`).

- **Hooks & Utility Functions:**  
  Use camelCase (e.g., `useAuth.ts`, `formatDate.ts`).

- **File Extensions:**  
  Use `.tsx` for files containing JSX and `.ts` for plain TypeScript files without JSX.

- **Consistent Naming:**  
  Make filenames clear and descriptive of their purpose.

---

## 2. File Size & Modularization

- **File Size Limit:**  
  Aim to keep files ≤ 250 lines. If a file grows too large, extract parts of the code into smaller, focused modules or utility files.

- **Modularization:**  
  - Group related functions, components, or hooks in a dedicated module.
  - Avoid "god" components or utilities; extract logic into custom hooks or helper functions.
  - For complex features, consider creating a dedicated feature folder within `src/screens` to group screens, hidden components, and related hooks.

---

## 3. Documentation & Comments

- **File Headers:**  
  Each file should begin with a brief header comment (1–2 lines) describing its purpose.

- **Function Documentation:**  
  Use TSDoc-style comments for all functions and hooks. For example:
  ```ts
  /**
   * Fetches a user by ID from Firestore.
   * @param userId - The user's unique identifier.
   * @returns The user data if found.
   */
  export function getUserById(userId: string) {
    // ...
  }
  ```

- **Inline Comments:**  
  Use sparing inline comments to explain non-obvious code sections. Avoid over-commenting trivial code.

---

## 4. Organization Patterns

- **Screens vs. Components:**  
  - **Screens:** High-level view components used in navigation. Place them in `src/screens` organized by feature (e.g., Auth, Feed, Groups, Profile).
  - **Reusable Components:** Generic UI elements that can be shared across screens should reside in `src/components`.

- **Hooks & Business Logic:**  
  Consolidate custom hooks in `src/hooks`. This is especially important for managing server state with React Query and shared UI state via Context.

- **Firebase Integration:**  
  Place all Firebase-related files (initialization, configuration, API wrappers) in `src/lib/firebase`.

- **Navigation:**  
  Define all navigators and route configurations within `src/navigation`. Centralize navigation-related logic for consistency and ease of updates.

- **Utilities and Types:**  
  Shared utility functions belong in `src/utils`, and TypeScript typings are stored in `src/types`.

---

## 5. Adherence to Tech-Specific Guidelines

- **ESLint & Prettier:**  
  Use ESLint and Prettier to enforce code style and catch common errors.

- **Testing:**  
  Mirror the folder structure from `src` in the `tests` directory to keep test files closely tied to the source code. Use Jest and React Native Testing Library for robust tests.

- **Consistency:**  
  Regularly review and update folder structures and naming conventions to ensure they evolve with the project requirements. Align with the best practices outlined in our [TypeScript + React Native Rules](./docs/rules/typescript-react-native-rules.md) and other specific rules documents.

---

## 6. Conclusion

These updated organization rules are tailored for the Kinetik project and its modern tech stack. By keeping our codebase well-structured, modular, and clearly documented, we can ensure a scalable and maintainable project that supports collaborative development and rapid iteration.

Follow these guidelines diligently, and feel free to update them as the project evolves or new best practices emerge.