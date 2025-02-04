# React Navigation Rules

## Best Practices
- **Strongly Typed Routes**  
  - Use TypeScript generics in navigators (e.g., `createStackNavigator<ParamList>()`) for type-safe route parameters.

- **Structured Navigation Hierarchy**  
  - Use top-level navigators (Stack, Tab, Drawer) for major regions of the app.  
  - Nest child navigators only where needed.

- **Deep Linking & URL Schemes**  
  - Configure linking options to support opening screens from external URLs.  
  - Test thoroughly across iOS and Android.

- **Performance**  
  - Avoid unnecessary re-mounting by placing navigation at the root of the app.  
  - Use lazy loading for screens that are not immediately needed.

## Limitations
- **Complex Navigation Stacks**  
  - Over-nesting can complicate parameter passing and debugging.  
  - Keep layering to a manageable level.

- **Platform Differences**  
  - Navigation gestures and transitions may differ on iOS vs Android; test thoroughly on both.

## Conventions
- **Navigator Organization**  
  - Maintain a dedicated file for each navigator (e.g., `AppNavigator.tsx`).  
  - Centralize route definitions and param types.

- **Screen Naming**  
  - Use consistent, descriptive screen names (e.g., `ProfileScreen`, `SettingsScreen`).

- **Linking Config**  
  - If supporting web or universal links, define a clear config for route mapping.

## Common Pitfalls
1. **Param Mismatch**  
   - Passing the wrong route params can cause runtime errors if TypeScript definitions aren’t aligned.
2. **Unmanaged Navigation State**  
   - Not resetting state or clearing routes properly can lead to navigational “back stack” issues.
3. **Unexpected Re-renders**  
   - Placing heavy logic in screen transitions may cause performance bottlenecks.
