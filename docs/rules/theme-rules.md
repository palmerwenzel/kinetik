# Theme Rules for Kinetik

These guidelines define the visual identity and theming principles for Kinetik. Our chosen theme is **Neumorphic**—characterized by soft, extruded elements with subtle shadows and tactile animations—using a soft white base with orange accents for light mode and dark gray/black with orange accents for dark mode. These rules ensure consistency across UI components, guide integration with our tech stack, and support accessibility.

---

## 1. Theme Overview

- **Neumorphic Design:**  
  Employ soft, embossed effects to create a realistic yet modern touch. The design relies on delicate inner and outer shadows to simulate raised, pressable surfaces.
- **Dual Mode Identity:**
  - **Light Mode:**
    - **Background:** A soft white or light gray foundation.
    - **Accents:** Vibrant orange, used for buttons, highlights, and actionable elements.
  - **Dark Mode:**
    - **Background:** Rich dark gray or black for a modern, dramatic contrast.
    - **Accents:** The same vibrant orange to maintain continuity and brand recognition.

---

## 2. Detailed Color Palette & Tokenization

- **Primary Colors:**  
  Define primary color tokens in your Tailwind configuration (e.g., `--color-bg-light`, `--color-bg-dark`, `--color-accent`):
  - Light Mode:
    - Background: `#FFFFFF` or a very light gray
    - Accent: `#FF6600`
  - Dark Mode:
    - Background: `#1A1A1A` or similar dark gray/black
    - Accent: `#FF6600`
- **Supporting Colors:**  
  Use subtle secondary hues for statuses, such as soft reds for errors or greens for success notifications. Ensure these choices meet WCAG contrast ratios (4.5:1 minimum for text).

- **Token Management:**  
  Centralize theme tokens in NativeWind’s config and extend NativeBase’s theme to ensure a uniform application across components.

---

## 3. Visual Style Guidelines

- **Shadows & Depth:**
  - Apply soft, diffused shadows to create a realistic extruded look.
  - For light mode, use lighter shadow colors (e.g., `rgba(166, 166, 166, 0.3)`); for dark mode, use darker, subtler shadows.
- **Typography:**  
  Use modern, sans-serif fonts (e.g., Inter, Open Sans) with a consistent typographic scale. Headings, body text, and labels should align with the overall neumorphic aesthetic.
- **Spacing & Layout:**  
  Maintain generous margins and paddings to reinforce the light, airy feel of the design. Consistent spacing helps delineate interactive zones clearly on mobile screens.
- **Rounded Corners:**  
  Implement moderate border radii (e.g., 12px) to enhance the soft, tactile quality of UI elements.

---

## 4. Animation & Interactive Feedback

- **Subtle Transitions:**
  - Use smooth transitions (all below 300ms) for hover, press, and focus states.
  - Utilize React Native’s Animated API to animate shadow depth, scaling, and opacity during interactions.
- **Interactive Cues:**

  - Buttons and cards should exhibit a “press” effect by deepening shadows or slight scaling.
  - Use responsive micro-animations to provide immediate feedback without distracting the user.

- **Loading & Skeleton States:**
  - Implement shimmer or pulse effects that adhere to the neumorphic style for placeholders during network calls or transitions.

---

## 5. Integration with Tech Stack & Backend

- **NativeWind & NativeBase Integration:**
  - Set up theme tokens in NativeWind’s Tailwind config.
  - Extend NativeBase components to include neumorphic variants ensuring consistency across UI elements.
- **Theme Preference Persistence:**
  - Store user theme preferences (light/dark mode selection and minor customizations) in Firebase or local storage.
  - Use Cloud Functions to sync theme settings across devices if applicable.
- **Testing & CI/CD:**
  - Validate visual consistency using snapshot tests in Jest.
  - Include UI regression tests in your GitHub Actions workflow to catch unintended theme changes.

---

## 6. Practical Code Examples

- **Light Mode Button:**

  ```tsx
  // Example using NativeBase with neumorphic styling for light mode
  <Button
    style={{
      backgroundColor: "#FFFFFF",
      shadowColor: "#A6A6A6",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      borderRadius: 12,
    }}
    _text={{ color: "#FF6600", fontWeight: "bold" }}
  >
    Post
  </Button>
  ```

- **Dark Mode Card:**
  ```tsx
  // Example using a Box component styled for dark mode
  <Box
    style={{
      backgroundColor: "#1A1A1A",
      shadowColor: "#000000",
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      borderRadius: 12,
    }}
    p={4}
  >
    <Text color="#FF6600" fontSize="md">
      Group Update
    </Text>
  </Box>
  ```

---

## 7. Accessibility & Continuous Improvement

- **Contrast & Legibility:**  
  Ensure all text and interactive elements maintain sufficient contrast. Regularly test with WCAG guidelines.
- **Focus & Active States:**  
  Provide distinct visual indicators (e.g., outlines, intensified shadows) on focus and active states for accessibility.
- **Iterative Design:**  
  Collaborate with UX designers to refine neumorphic effects over time. Rapidly iterate feedback from real user interactions and testing sessions.

---

By adhering to these theme rules, Kinetik will maintain a unified, visually appealing interface that reinforces our brand’s core identity—fostering community, accountability, and personal growth in an engaging, mobile-first environment.
