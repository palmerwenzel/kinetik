/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: "#FF6600",
        "primary-light": "#FF8533",
        "primary-dark": "#CC5200",

        // Text colors with proper contrast
        text: "#1A1A1A",
        "text-secondary": "#666666",
        "text-tertiary": "#999999",
        "text-dark": "#FFFFFF",
        "text-dark-secondary": "#CCCCCC",
        "text-dark-tertiary": "#999999",
        "text-primary": "#FF6600", // Add explicit text color for primary
        "text-primary-light": "#FF8533", // And its variants

        // Background and surface colors
        background: "#F0F0F3", // Light gray for neumorphic effect
        "background-dark": "#1A1A1A",
        surface: "#F0F0F3", // Matching background for consistent depth
        "surface-dark": "#2A2A2A",

        // Border colors for subtle definition
        border: "#E5E5E5",
        "border-dark": "#404040",

        // Status colors with proper contrast
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      borderRadius: {
        neu: "12px", // Consistent border radius for neumorphic design
      },
      boxShadow: {
        // Light mode shadows
        "neu-sm": "3px 3px 6px rgba(166, 166, 166, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.7)",
        "neu-md": "5px 5px 10px rgba(166, 166, 166, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.8)",
        "neu-lg":
          "10px 10px 20px rgba(166, 166, 166, 0.4), -10px -10px 20px rgba(255, 255, 255, 0.9)",
        "neu-pressed":
          "inset 3px 3px 6px rgba(166, 166, 166, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.7)",

        // Dark mode shadows
        "neu-sm-dark": "3px 3px 6px rgba(0, 0, 0, 0.4), -3px -3px 6px rgba(75, 75, 75, 0.1)",
        "neu-md-dark": "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(75, 75, 75, 0.15)",
        "neu-lg-dark": "10px 10px 20px rgba(0, 0, 0, 0.6), -10px -10px 20px rgba(75, 75, 75, 0.2)",
        "neu-pressed-dark":
          "inset 3px 3px 6px rgba(0, 0, 0, 0.4), inset -3px -3px 6px rgba(75, 75, 75, 0.1)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
