# Fixing "Unmatched Route" Errors in CreateGroup Steps

When adding a new \_layout.tsx in the "steps" folder to organize the multi-step form, you may encounter "Unmatched Route" or "No route named steps/basics" errors. This usually stems from how Expo Router interprets folder structures and filenames. Below is an explanation of the problem and how to resolve it.

---

## Understanding the Problem

1. **Nested Layout vs. Nested Routes**  
   By placing a "\_layout.tsx" inside "app/(groups)/createGroup/steps/", you're telling Expo Router that "steps" is itself a route group. Inside that layout, you define child screens with:
   » basics  
   » visibility  
   » posting  
   » review

   However, if you also reference these steps from "createGroup/index.tsx" (or from other step files) using relative paths like "../steps/..." or contrived backwards/forwards navigation, Expo Router might fail to match them correctly.

2. **Expo Router Treating Non-Route Files as Routes**  
   If you have files named "step-header.tsx" or "step-navigation.tsx" in "components/", Expo Router may attempt to parse them as route screens if they exist directly in the route folder structure. This can also cause warnings about missing default exports. For shared UI components, you typically want them in a folder that Expo Router doesn't treat as a route, such as:

   - app/(groups)/createGroup/components/step-header.component.tsx
   - app/(groups)/createGroup/components/step-navigation.component.tsx  
     Alternatively, place them in src/components, which leaves your route folders clean.

3. **Missing or Incorrect Path Definitions**  
   In your parent layout "app/(groups)/createGroup/\_layout.tsx", you must ensure that a <Stack.Screen name="steps" /> is actually declared. Then, within the "steps" folder, "\_layout.tsx" can declare <Stack.Screen name="basics" />, <Stack.Screen name="visibility" />, etc. If either layout omits the correct screen definitions, or if you navigate incorrectly (for instance, using ../steps/visibility instead of just steps/visibility), you'll see unmatched route errors.

---

## How to Resolve

Below are steps you can take to ensure your routing is correctly configured.

1. **Rename or Move Shared Components**

   - If "step-header.tsx" and "step-navigation.tsx" are meant to be plain UI components (and not route screens), store them in a folder that Expo Router doesn't treat as a route, such as:
     - app/(groups)/createGroup/components/step-header.component.tsx
     - app/(groups)/createGroup/components/step-navigation.component.tsx
   - Alternatively, place them in src/components, which leaves your route folders clean.

2. **Define the "steps" Route Properly**

   - In app/(groups)/createGroup/\_layout.tsx, include a <Stack.Screen name="steps" />. This declares that any route under /createGroup/steps/ belongs to that nested stack.
   - Inside the steps folder, your steps/\_layout.tsx can define:
     - <Stack.Screen name="index" redirect />
     - <Stack.Screen name="basics" />
     - <Stack.Screen name="visibility" />
     - etc.
   - That way, "basics.tsx" becomes /createGroup/steps/basics, and so on.

3. **Use Correct Path References**

   - From createGroup/index.tsx (or from a step), navigate to a step via:
     router.push("steps/basics")
     rather than '../steps/basics' or './steps/basics' when you're already at /createGroup.
   - From within one step file to another (both siblings in "steps"), you would typically just do:
     router.push("visibility")
     or
     router.push("posting")
     (no extra "../steps/" prefix).

4. **Add an Index Fallback if Needed**

   - If you want "/createGroup/steps" itself to direct users to "/createGroup/steps/basics", you can place an index.tsx file in "steps" that redirects. For example:
     ```typescript:app/(groups)/createGroup/steps/index.tsx
     import { Redirect } from "expo-router";
     export default function StepsIndex() {
       return <Redirect href="basics" />;
     }
     ```
   - Coupled with <Stack.Screen name="index" redirect={true} /> in steps/\_layout.tsx, this ensures going to "/steps" automatically pushes to the first step.

5. **Clean Up Old Navigation Calls**
   - Remove or update any calls like:
     router.push("../steps/basics")
     router.push("../steps/visibility")
     so that they correctly read:
     router.push("basics")
     (if you're already inside "steps"), or
     router.push("steps/basics")
     (if you're inside "createGroup" and want to go into "steps").

---

## Summary

By keeping component files separate from route definition files, ensuring each layout accurately declares its children, and using direct path references ("steps/basics" instead of backtracking with "../steps/basics"), you'll avoid "Unmatched Route" and "No route named steps/basics" errors. Make sure each route file exports a default component, and any shared UI components are placed in a folder outside the route tree (or renamed to avoid collisions).

With these adjustments, your step-based flow in "app/(groups)/createGroup/steps" should function smoothly under Expo Router.
