/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#1565C0',
        dark: '#1a1a2e',
        light: '#f8f9fa',
      }

    },
  },
  plugins: [],
}