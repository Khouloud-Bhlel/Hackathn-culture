/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          900: '#641B2E',
          800: '#7A2139',
          700: '#8F2744',
          600: '#A42D4F',
          500: '#B9335A',
        },
        green: {
          700: '#6E9132',
          600: '#82AD3B',
          500: '#95C444',
          400: '#A9DB4D',
          300: '#BCF156',
        },
        pink: {
          700: '#A54A43',
          600: '#BE5B50',
          500: '#D16C5D',
          400: '#E47E6A',
          300: '#F78F77',
        },
        sand: {
          200: '#FBDB93',
          100: '#FDF0D9',
          50: '#FEF7EC',
        },
      },
      fontFamily: {
        'noto-arabic': ['"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        'custom': '0 10px 25px -5px rgba(100, 27, 46, 0.1), 0 8px 10px -6px rgba(100, 27, 46, 0.05)',
      },
      height: {
        'screen-90': '90vh',
      },
    },
  },
  plugins: [],
};