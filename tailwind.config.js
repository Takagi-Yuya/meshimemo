/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad7a5',
          300: '#f6bb6d',
          400: '#f19a38',
          500: '#ee7f15',
          600: '#df650b',
          700: '#b94c0b',
          800: '#933c10',
          900: '#773310',
        },
      },
    },
  },
  plugins: [],
}
