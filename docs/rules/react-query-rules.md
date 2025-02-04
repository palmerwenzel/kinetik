# React Query + Context Rules

## Best Practices

- **Separation of Concerns**

  - Handle **server state** with React Query.
  - Use **React Context** for global UI or ephemeral state (e.g., toggling side panels or storing theme preferences).

- **Query & Mutation Patterns**

  - Co-locate queries and mutations in features or modules they pertain to.
  - Centralize React Query config in a root provider with a custom `QueryClient`.

- **Caching & Invalidation**

  - Provide sensible cache times based on data volatility.
  - Use proper invalidation triggers (`invalidateQueries`) when user actions update data.

- **Optimistic Updates**

  - For responsiveness, use optimistic updates in React Query.
  - Rollback changes gracefully if the server request fails.

- **Context Usage**
  - Maintain minimal, targeted contexts to avoid unnecessary re-renders.
  - For complex global data, consider a dedicated store or multiple smaller contexts.

## Limitations

- **Overusing Context**

  - Storing too much in a single context can cause performance issues.
  - React Query is more efficient for data fetching, caching, and syncing with remote sources.

- **Complex Global State**
  - React Query doesn’t replace a full-fledged global store if you have large-scale local complexities.
  - Evaluate if simpler local state is sufficient or if you need more advanced solutions.

## Conventions

- **React Query Keys**

  - Define descriptive strings or arrays for keys (e.g., `['user', userId]`).
  - Keep them consistent to avoid accidental collisions.

- **useQuery / useMutation**

  - Create custom hooks wrapping `useQuery` and `useMutation` for reusability.
  - Return typed data and handle loading/error states in the UI layer.

- **Context Structure**
  - For UI-only state, place context in the relevant feature directory.
  - Use context providers at the top of the relevant screen or app entry.

## Common Pitfalls

1. **Excessive Re-Renders**
   - Overly broad context providers can trigger many re-renders. Keep scopes small.
2. **Default Caching Issues**
   - Not adjusting default `staleTime` or `cacheTime` can lead to frequent refetches or outdated data.
3. **Unclear Query Keys**
   - Clashing query keys lead to confusing data management and unexpected cache collisions.
