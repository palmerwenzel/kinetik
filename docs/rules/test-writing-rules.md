# Jest + React Native Testing Library (RNTL) Rules

## Best Practices
- **Isolated Tests**  
  - Keep unit tests small, focusing on one component or function.  
  - Mock data properly to avoid external dependencies.

- **Descriptive Testing**  
  - Use clear, behavior-driven test descriptions (`it('renders user name')`).  
  - Group related specs using `describe`.

- **Snapshot Testing**  
  - Use snapshots for visual components where layout changes are minimal.  
  - Update or remove snapshots if major design changes occur.

- **Integration & E2E**  
  - Complement unit tests with integration tests to ensure logic flows correctly.  
  - Use tools like Detox for end-to-end testing if needed.

## Limitations
- **Async Testing Complexity**  
  - Testing asynchronous calls, especially with React Query or data fetching, can be tricky.  
  - Use `await waitFor(...)` or `jest.useFakeTimers()` carefully.

- **Mocking**  
  - Over-mocking can hide real bugs. Keep mocks minimal.  
  - Some native modules may require custom mocks (e.g., react-native-fs).

## Conventions
- **File Naming**  
  - Suffix files with `.test.tsx` or `.test.ts`.  
  - Mirror directory structure of the components/functions being tested.

- **Setup Files**  
  - Create a global test setup (`jest.setup.js`) for configuring RNTL or mocking RN environment.

- **Testing Patterns**  
  - Rely on user-centric queries (e.g., `getByText`, `getByRole`) instead of implementation details (`querySelectorAll`).

## Common Pitfalls
1. **Not Waiting for UI Updates**  
   - Failing to wait for asynchronous rendering or React Query data to load leads to false negatives.
2. **Overly Complex Snapshots**  
   - Large snapshots are brittle; break them down or rely on component-level tests.
3. **Neglecting Edge Cases**  
   - Not testing error states, empty data, or boundary conditions can miss faulty behaviors.
