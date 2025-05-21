/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      equation: ["Bitter", "serif"],
    },
    extend: {},
  },
  //darkMode: 'class', // Enable dark mode via class
  plugins: [require('@tailwindcss/typography')],
}

