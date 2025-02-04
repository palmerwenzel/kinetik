/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")], // <-- IMPORTANT
  content: [
    // Make sure these paths actually match your folder structure
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'bg-light': '#FFFFFF',
        'accent': '#FF6600',
        'accent-light': '#FF8533',
        'accent-dark': '#CC5200',
        
        // Dark mode colors
        'bg-dark': '#1A1A1A',
        'bg-dark-secondary': '#262626',
        
        // Status colors (with proper contrast ratios)
        'success': '#22C55E',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'info': '#3B82F6',
      },
      // Neumorphic shadow utilities
      boxShadow: {
        'neu-light': '4px 4px 8px rgba(166, 166, 166, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-dark': '4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(38, 38, 38, 0.5)',
        'neu-pressed-light': 'inset 4px 4px 8px rgba(166, 166, 166, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-pressed-dark': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(38, 38, 38, 0.5)',
      },
      borderRadius: {
        'neu': '12px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}; 