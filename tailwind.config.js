/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Satoshi',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        headline: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'reverse-spin': 'reverse-spin 8s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'logo-spin': 'logo-spin 4s ease-in-out infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)'
          },
          to: {
            transform: 'rotate(0deg)'
          },
        },
        'gentle-pulse': {
          '0%, 100%': { 
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: 0.8,
            transform: 'scale(0.95)'
          },
        },
        'logo-spin': {
          '0%': { 
            transform: 'rotate(0deg) scale(1)'
          },
          '25%': {
            transform: 'rotate(90deg) scale(0.95)'
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1)'
          },
          '75%': {
            transform: 'rotate(270deg) scale(0.95)'
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)'
          }
        },
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
};