/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#ff6b6b',
        accent: '#ffd700',
        dark: '#1a1a1a',
        light: '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
