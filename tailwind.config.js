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
          50: '#fff5f0',
          100: '#ffe8d6',
          200: '#ffd4b8',
          300: '#ffb088',
          400: '#ff8c5a',
          500: '#f97335',
          600: '#e85d20',
          700: '#c44a18',
          800: '#9c3b15',
          900: '#7e3214',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        peach: {
          50: '#fff8f5',
          100: '#ffefea',
          200: '#ffddd2',
          300: '#ffcab5',
          400: '#ffaa8a',
          500: '#ff8a60',
        },
        cream: {
          50: '#fffcf7',
          100: '#fff8ed',
          200: '#fff0d6',
          300: '#ffe4b5',
        },
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(249, 115, 53, 0.15)',
        'warm-lg': '0 10px 25px -3px rgba(249, 115, 53, 0.2)',
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px 0 rgba(249, 115, 53, 0.18)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'slot': 'slot 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slot: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
