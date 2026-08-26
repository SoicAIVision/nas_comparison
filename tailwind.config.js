/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synology: {
          blue: '#00629b',
          dark: '#0e1e2d',
          light: '#e6f0f7',
        },
      },
    },
  },
  plugins: [],
}
