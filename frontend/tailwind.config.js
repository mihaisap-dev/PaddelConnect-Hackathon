/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sport-neon': '#D4F01C', 
        'sport-dark': '#0A0A0A',
        'sport-gray': '#1F1F1F',
      },
    },
  },
  plugins: [],
}