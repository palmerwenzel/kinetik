# Type System Rules for Kinetik

This document outlines our approach to type management in the Kinetik project. Our strategy is designed to leverage TypeScript for type safety across our React Native app while accommodating Firebase’s flexible, schema-less structure. These guidelines replace our older Supabase-based approach and are aligned with our [Project Overview](../project-info/project-overview.md), [Tech Stack](../project-info/tech-stack.md), and [Codebase Organization Rules](../rules/codebase-organization-rules.md).

---

## 1. Type Hierarchy

### 1.1. Raw Firestore Types (Db Types)
- **Purpose:** Manually define the expected structure of Firestore documents.
- **Usage:** Use these types only in Firebase API wrappers.
- **Naming:** Prefix with `Db` (e.g., `DbUser`, `DbGroup`).
- **Example:**

  ```typescript
  // File: src/types/firebase/firestoreTypes.ts
  export interface DbUser {
    uid: string;
    email: string;
    created_at: string; // Saved in ISO string or as Firestore Timestamp string
    // Additional raw fields as stored in Firestore
  }
  ```

### 1.2. Domain Types
- **Purpose:** Define application-specific types that refine raw data with business logic, computed values, and UI-friendly formats.
- **Usage:** Import these types throughout the application.
- **Naming:** Use plain names (e.g., `User`, `Group`).
- **Example:**

  ```typescript
  // File: src/types/domain/user.ts
  import type { DbUser } from '../firebase/firestoreTypes';

  export interface User extends DbUser {
    createdAt: Date; // Converted from `created_at`
    role: 'admin' | 'member'; // Refined from a generic string
  }
  ```

### 1.3. Validation Schemas
- **Purpose:** Validate and transform data at runtime using Zod.
- **Usage:** Validate incoming data from Firestore or user input in forms, ensuring that it conforms to the expected domain type.
- **Naming:** Suffix with `Schema` (e.g., `userSchema`).
- **Example:**

  ```typescript
  // File: src/lib/validations/userSchema.ts
  import { z } from 'zod';
  import type { User } from '../../types/domain/user';

  export const userSchema = z.object({
    uid: z.string(),
    email: z.string().email(),
    created_at: z.string(),
  }).transform((raw) => ({
    ...raw,
    createdAt: new Date(raw.created_at),
    role: 'member', // Default value; adjust as needed
  })).refine((data): data is User => {
    // Custom validation logic if necessary.
    return true;
  });
  ```

---

## 2. Transformation Workflow

```
Firestore Raw Data (Db Types)
       ↓  [Transformation Functions]
Domain Types (Correct Business Logic & Computed Values)
       ↓  [Validation]
Validation Schemas (Runtime Data Checks via Zod)
```

- **Conversion Examples:**  
  Convert Firestore `Timestamp` to a JavaScript `Date` and map snake_case fields (e.g., `created_at`) to camelCase (`createdAt`).

---

## 3. Naming and Structure Conventions

- **Firestore vs. Domain:**  
  - Database/Firestore document fields use **snake_case**.
  - Domain types and UI code use **camelCase**.
- **Folder Organization:**  
  - **Raw Types:** Located in `src/types/firebase/`
  - **Domain Types:** Located in `src/types/domain/`
  - **Validation Schemas:** Located in `src/lib/validations/`
  - **Transformation Functions:** Placed under `src/lib/transformers/`

---

## 4. Practical Guidelines

- **Do Not Import Raw Types Directly:**  
  Always transform raw Firestore data into domain types before using them in the application.
- **Maintain Clear Separation:**  
  Backend (Cloud Functions) may use the Admin SDK types, but these should be transformed to domain types when sent to the client.
- **Document Transformations:**  
  Use TSDoc-style comments for transformer functions to explain how data is converted.
- **Keep It Synchronized:**  
  Any changes in Firestore structure should be reflected in raw type definitions and corresponding transformations.

---

## 5. Conclusion

Our revised type system rules foster a clear separation between the raw Firestore data and our application logic, ensuring robust type safety throughout the codebase. By following these guidelines, we are equipped to handle Firebase’s schema-less nature while enforcing the integrity and consistency required for a scalable, maintainable mobile application.

This approach leverages TypeScript’s power and works in tandem with our chosen tooling—React Native, Firebase, and modern validation libraries—to create a predictable and robust development environment.