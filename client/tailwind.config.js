/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom pastel color palette
        lavender: {
          50: '#faf8ff',
          100: '#f3efff',
          200: '#e9e2ff',
          300: '#d4c6ff',
          400: '#b89fff',
          500: '#9b71ff',
          600: '#8b4fff',
          700: '#7c3aed',
        },
        blush: {
          50: '#fef7f7',
          100: '#feeaea',
          200: '#fdd8d8',
          300: '#fbb6b6',
          400: '#f78888',
          500: '#ef5555',
          600: '#dc3545',
        },
        peach: {
          50: '#fff8f5',
          100: '#fff0e8',
          200: '#ffdcc7',
          300: '#ffc19d',
          400: '#ff9d66',
          500: '#ff7a3d',
        },
        mint: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(139, 79, 255, 0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
