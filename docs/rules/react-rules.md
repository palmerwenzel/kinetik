# React Native Rules

## Best Practices
- **Strong Typings**  
  - Always enable `strict` mode in `tsconfig.json`.  
  - Use type definitions for React Native modules and any third-party libraries.  
  - Prefer interfaces over types for object shapes when extending or merging.  
  - Utilize utility types (e.g., `Partial`, `Pick`) for DRY code.

- **Functional Components**  
  - Use function components instead of class components for simplicity.  
  - Leverage React Hooks (`useState`, `useEffect`, `useReducer`) in functional components.

- **Platform-Specific Files**  
  - Take advantage of `.ios.tsx` / `.android.tsx` file naming when necessary.  
  - Only diverge by platform if OS-specific logic is required.

- **Performance Optimizations**  
  - Memoize heavy computations or avoid unnecessary re-renders with `React.memo`.  
  - Use the `FlatList` or `SectionList` components for large data sets.  
  - Consider code-splitting with dynamic imports where possible (e.g., for rarely used features).

- **Code Organization**  
  - Keep a clear folder structure for screens, components, hooks, etc.  
  - Group related modules logically to improve maintainability and clarity.

## Limitations
- **Native Modules**  
  - If a feature is not covered by React Native, a custom native module might be needed, which requires some platform-specific knowledge and bridging.

- **Binary Sizes**  
  - Apps built with React Native can be larger than purely native equivalents.  
  - Use code splitting, and remove unnecessary packages.

- **Fragmented Debugging**  
  - Debugging can be split across TypeScript compilation issues and native build configurations.

## Conventions
- **File Naming**  
  - Use PascalCase for component filenames (e.g., `UserProfile.tsx`).  
  - Keep TypeScript files in `.ts` or `.tsx` extension.

- **Imports**  
  - Prefer absolute imports (using Babel module resolver or TS path aliases) for clarity.  
  - Group imports by standard, third-party, and local modules.

- **Lint and Formatting**  
  - Use ESLint with `@typescript-eslint` plugin.  
  - Keep a consistent code style with Prettier.

## Common Pitfalls
1. **Ignoring Type Errors**  
   - Relying on `any` or disabling the compiler leads to hidden bugs. Strict typing catches these early.

2. **Improper Performance Handling**  
   - Overusing inline functions or ignoring `useCallback` can degrade performance on re-renders.

3. **Inconsistent Navigation Props**  
   - Not properly typing navigation parameters can cause runtime errors.

4. **Unhandled Type Definitions for Native Libraries**  
   - Some community libraries may not include TypeScript definitions. Always install or create your own `.d.ts` files.
