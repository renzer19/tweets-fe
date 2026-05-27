/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1d9bf0', 
        darkbg: '#000000',
        cardbg: '#16181c',
        bordercolor: '#2f3336'
      }
    },
  },
  plugins: [],
}