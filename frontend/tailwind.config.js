/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terp-blue': '#3B82F6',
        'terp-red': '#EF4444',
        'terp-navy': '#1E3A8A',
      },
    },
  },
  plugins: [],
}