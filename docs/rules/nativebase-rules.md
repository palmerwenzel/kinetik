# NativeBase Rules

## Best Practices

- **Consistent Theming**

  - Centralize theme customization in a `NativeBaseProvider`.
  - Override or extend default design tokens (colors, fonts, spacing) as needed.

- **Leverage Compound Components**

  - Use built-in components (e.g., `Box`, `Center`, `Button`) for consistent styling and theming.
  - Adjust variants (e.g., `solid`, `outline`) for different states.

- **Composability**

  - Create custom component wrappers for repeated patterns.
  - Keep stylings in reusable theme variants instead of inline styling.

- **TypeScript Integration**
  - Leverage the typed props (e.g., for `Box`, `VStack`), ensuring consistent usage.

## Limitations

- **Over-Reliance on Default Styling**

  - NativeBase defaults might conflict with brand guidelines if not carefully overridden.

- **Performance Overhead**
  - Using complex or deeply nested NativeBase components can affect rendering on low-end devices.

## Conventions

- **Theme Structure**

  - Maintain color scales for primary, secondary, etc.
  - Keep consistent spacing multiples (e.g., multiples of 4 or 8).

- **Props Usage**
  - Prefer `variant` props to handle different stylistic states.
  - Apply Tailwind classes directly on React Native components for styling; the latest version of NativeWind supports this.

## Common Pitfalls

1. **Misconfiguring Theme**
   - Overlapping or conflicting theme settings can lead to unpredictable styling.
2. **Fragmented Style Patterns**
   - Mixing multiple styling solutions (e.g., inline styles, NativeBase, separate Tailwind classes) can create confusion.
3. **Ignoring Platform Differences**
   - Some components behave slightly differently on iOS vs Android.
