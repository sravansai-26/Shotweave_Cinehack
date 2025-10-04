// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // CRITICAL: Tells Tailwind where to find your utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all files in the src/ directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};