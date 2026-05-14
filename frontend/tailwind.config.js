/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'puja-bg': '#fdfaf7',
        'puja-text': '#2d1a12',
        'puja-muted': '#6b584c',
        'saffron': {
          50: '#fff9ed', 
          100: '#ffefd6',
          200: '#ffdbad',
          300: '#ffbf7a',
          400: '#ff9a47',
          500: '#ff7a1a', // Primary Saffron
          600: '#f05a0a',
          700: '#c7410a',
          800: '#9e350f',
          900: '#7f2e12',
        },
        'gold': {
          500: '#d4af37',
          600: '#b8860b',
        },
        'maroon': {
          800: '#5a1212',
          900: '#3d0a0a',
        }
      },
      backgroundImage: {
        'divine-pattern': "url('https://www.transparenttextures.com/patterns/p6.png')",
        'hero-gradient': "linear-gradient(to bottom, rgba(45, 26, 18, 0.4), rgba(45, 26, 18, 0.8))",
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

