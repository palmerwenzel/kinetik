# Step 4: Validation & Commit

**Goal:** Finalize your implementation by verifying adherence to our project rules, creating and executing tests, and committing changes on an appropriate branch with clear, descriptive commit messages.

---

## 1. Codebase Validation

- **Adherence Check:**  
  Ensure your changes align with the following, where relevant:
  - [Codebase Organization Rules](../rules/codebase-organization-rules.md)
  - [Type System Rules](../rules/type-system-rules.md)
  - [Firebase Rules](../rules/firebase-rules.md)
  - [NativeBase Rules](../rules/nativebase-rules.md)
  - [NativeWind Rules](../rules/nativewind-rules.md)
  - [React Navigation Rules](../rules/react-navigation-rules.md)
  - [React Query + Context Rules](../rules/react-query-rules.md)
- **Linting & Type Checking:**
  - Run ESLint and Prettier to ensure consistent code style.
  - Execute the TypeScript compiler to check for any type errors.

---

## 2. Test Creation & Verification

- **Write/Update Tests:**
  - Follow @test-writing-rules.md for unit tests for any new components, functions, or modules using Jest and React Native Testing Library.
  - Add integration or end-to-end tests if necessary (e.g., using Detox or similar tools).
  - Include snapshot tests for visual components where appropriate.
- **Execute Tests:**
  - Run `npm test` to ensure all tests pass.
  - Confirm that edge cases, error states, and data transformation logic are properly covered.
- **Document Testing:**
  - Note any non-standard test scenarios or deviations.
  - Update relevant checklists or documentation if test updates reveal new validation requirements.

---

## 3. Branching & Commit Guidelines

- Defer to user for comprehensive branching and commit guidelines.

---

## 4. Final Validation Checklist

- Confirm that all changes have been reviewed against the project rule documents.
- Validate that tests cover new implementations and pass without errors.
- Document and communicate any deviations from initial plans in either `frontend-workflow.md` or `backend-workflow.md`.
- Once validated, merge the changes using your branch strategy and ensure the continuous integration pipeline passes.

---

By following these steps, you ensure that your implementation not only adds the desired functionality but also maintains adherence to our quality standards and best practices. Happy coding and validating!
