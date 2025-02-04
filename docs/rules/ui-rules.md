# UI Rules for Kinetik

These guidelines establish best practices for building mobile-first, gently responsive, and animated UI components in Kinetik. They integrate our core technologies (React Native, NativeBase, NativeWind, React Query, and Firebase) with our user flow—from authentication to content posting and group interactions—ensuring a consistent, accessible, and engaging experience.

---

## 1. Mobile-First Design & Gently Responsive Layout

- **Mobile-First Approach:**  
  Design every component primarily for mobile devices. Leverage React Native’s flexible layouts (Flexbox) and NativeWind’s utility classes to support different screen sizes and device orientations.
  
- **Fluid & Adaptive Layouts:**  
  Use relative dimensions (percentages, flex ratios) and media query equivalents (via platform checks) to create layouts that adjust smoothly from smaller smartphones to larger tablets.
  
- **Clear Information Hierarchy:**  
  Structure screens to highlight critical content. Employ padding, margins, and grid-like arrangements (where applicable) to guide users through authentication, dashboard overviews, group interactions, and feed exploration.

---

## 2. Navigation & Information Architecture

- **Simplified Navigation:**  
  Utilize React Navigation to implement tab-based, stack, or drawer navigators. Ensure navigation elements are clearly labeled and organized according to user roles (e.g., Creator vs. Community Member).
  
- **User Flow Integration:**  
  Reflect the high-level journeys defined in [user-flow.md]. For example, onboarding screens should transition seamlessly into profile setups and then to group or feed views.
  
- **Role-Based Interfaces:**  
  Adapt navigation and screen content based on user roles to surface relevant actions (e.g., group creation, posting, and quick actions on the dashboard).

---

## 3. Component Construction & Reusability

- **Consistent Component Structure:**  
  Group related components (e.g., Auth, Feed, Groups, Dashboard) into feature-specific folders. Ensure components are small, reusable, and follow a consistent naming convention.
  
- **Integration with NativeBase & NativeWind:**  
  - Build on NativeBase’s compound components and theme variants for consistent styling.  
  - Use NativeWind’s Tailwind syntax to rapidly prototype and enforce design consistency.
  
- **State & Data Binding:**  
  Connect UI components to backend logic using React Query (for asynchronous states like loading, error, and success) and React Context for local UI state management. Display loading spinners, skeletons, or toast messages as needed.

---

## 4. Interactivity & Animated Transitions

- **Subtle Micro-Animations:**  
  Enhance user feedback using React Native’s Animated API or Reanimated for transitions such as button presses, list refreshes, and screen navigations. Keep animations short (<300ms) to maintain responsiveness.
  
- **Touchable Feedback:**  
  All interactive elements (buttons, cards, lists) must provide visual cues such as opacity changes, scale transforms, or shadow alterations to indicate a press or focus.
  
- **Page & Component Transitions:**  
  Ensure smooth transitions between screens. For example, use fade or slide effects to guide users from the login screen to the main dashboard with ease.

---

## 5. Backend Tie-Ins & Data-Driven UI States

- **Real-Time Data Updates:**  
  Use Firebase’s Firestore onSnapshot subscriptions and React Query to reflect backend changes (e.g., new group posts or notifications) instantly in the UI.
  
- **Error & Success Messaging:**  
  Display clear and context-sensitive messages (using toast or inline alerts) for data submission, network errors, or successful operations.
  
- **Loading & Skeleton States:**  
  When fetching content, show skeleton components or spinners that match the overall design language to minimize perceived latency.

---

## 6. Accessibility & Quality Assurance

- **Accessible Touch Targets:**  
  Maintain minimum target sizes (e.g., 44x44 points) for interactive elements. Use accessible labels and hints for buttons and form fields.
  
- **Color Contrast & Visibility:**  
  Ensure that text against backgrounds (especially in dark mode) meets WCAG guidelines. Emphasize focus and active states with clear outlines or highlights.
  
- **Testing & Validation:**  
  Implement automated testing using Jest and React Native Testing Library. Integrate snapshot tests and interactive UI tests (possibly via Detox) in GitHub Actions to catch visual regressions and maintain usability.

---

## 7. Documentation & Best Practices

- **Component Documentation:**  
  Document the purpose and usage of reusable components. Include code examples and instructions for integrating backend hooks.
  
- **Iterative Improvements:**  
  Regularly review and update UI components based on user feedback and evolving technical requirements.
  
- **Design Consistency:**  
  Continuously reference these guidelines during development to ensure a coherent and polished user experience across all screens.

---

By following these UI rules, Kinetik will deliver an intuitive, fast, and accessible mobile experience that effectively supports user-driven content creation, group dynamics, and ongoing personal engagement.