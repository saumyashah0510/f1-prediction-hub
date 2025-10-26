/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#E10600',
          black: '#15151E',
          white: '#FFFFFF',
          gray: '#949498',
        }
      },
      fontFamily: {
        f1: ['Formula1', 'sans-serif'],
      }
    },
  },
  plugins: [],
}