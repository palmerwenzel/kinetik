# Tech Stack Rules

## React Native & Expo

- Using the latest stable version of Expo SDK
- Leveraging Expo's managed workflow for simplified development
- Following Expo's best practices for native functionality

## Styling & Theming

### NativeWind Integration

- Use NativeWind directly instead of custom theme providers
- Leverage `useColorScheme` from NativeWind for dark/light mode detection
- Example:

  ```tsx
  import { useColorScheme } from "nativewind";

  export function Component() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    // ...
  }
  ```

### Tailwind Configuration

- Keep color definitions flat and semantic (e.g., `primary`, `surface`, `text`)
- Use consistent naming for dark mode variants (e.g., `dark:bg-surface-dark`)
- Utilize neumorphic design classes:
  - `shadow-neu-md` for default state
  - `shadow-neu-pressed` for pressed state
  - `rounded-neu` for consistent border radius

### Component Styling

- Use className prop with template literals for complex conditional styles
- Group related styles using consistent patterns:
  ```tsx
  className={`
    p-4 rounded-neu
    bg-surface dark:bg-surface-dark
    shadow-neu-md dark:shadow-neu-md-dark
    ${conditionalClass ? "active:opacity-70" : ""}
  `}
  ```
- Avoid inline styles unless absolutely necessary for dynamic values

## State Management

- Use React's built-in hooks for local state
- Leverage Context API for global state when needed
- Avoid unnecessary state management libraries

## Type Safety

- Strict TypeScript configuration
- Use `zod` for runtime validation
- Define explicit types for all props and state
- Avoid `any` and `unknown` types unless absolutely necessary

## Performance

- Implement proper memo-ization for expensive computations
- Use `useCallback` and `useMemo` judiciously
- Optimize image assets using Expo's image handling

## Testing

- Jest for unit testing
- React Native Testing Library for component testing
- E2E testing strategy TBD

---

This document will be updated as we establish more stack-specific rules and patterns.
