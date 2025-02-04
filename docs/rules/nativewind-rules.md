# NativeWind Rules

## Best Practices

- **Utility-First Styling**

  - Use Tailwind classes (`bg-indigo-500`, `p-4`) for fast, consistent styling.
  - Keep composition short and descriptive, avoiding overly verbose class lists.

- **Theme Integration**

  - Combine with NativeBase or other theming solutions responsibly.
  - Map NativeBase theme values to Tailwind if needed for consistent design.

- **Responsive Design**
  - Utilize RN’s built-in `Dimensions` or responsive utility classes from NativeWind for the best mobile-first approach.

## Limitations

- **Limited Control Over Complex Layouts**

  - For advanced or custom layout logic, raw style objects may still be needed.

- **Performance Overhead**
  - Overuse of inline utility classes on large lists can incur rendering overhead.
  - Minimize re-renders or rely on internal caching.

## Conventions

- **Class Naming**

  - Keep logic-based classes minimal (e.g., use `conditional ? 'bg-blue-500' : 'bg-gray-500'`).
  - Combine often-used class sets into small, repeated patterns to avoid duplication.

- **Structure**
  - Keep Tailwind usage consistent, prefer alphabetical ordering or logical grouping in class lists.

## Common Pitfalls

1. **Overly Long Class Strings**
   - Hard to maintain and debug—split them into multiple lines or use style composition.
2. **Mixing Multiple Approaches**
   - Combining too many styling solutions (NativeBase variants, inline, Tailwind) can lead to conflicts.
3. **Configuration Misalignment**
   - Not aligning Tailwind config with brand colors or spacing leads to inconsistent design.
