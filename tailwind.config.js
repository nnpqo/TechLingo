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
          50: '#f5f3ff',
          500: '#6C63FF',
          600: '#5551d7',
          700: '#4440af',
          900: '#1a1333',
        },
        secondary: '#00D4AA',
        accent: '#FF6B6B',
        warning: '#FFB347',
        'bg-dark': '#0F0F1A',
        'bg-card': '#1A1A2E',
        'bg-elevated': '#16213E',
        'text-primary': '#E8E8F0',
        'text-secondary': '#9090A0',
        'border-color': '#2A2A3E',
        'cyber': '#FF4757',
        'frontend': '#1E90FF',
        'backend': '#2ED573',
        'database': '#FFA502',
        'devops': '#FF6348',
        'network': '#7B68EE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'bounce-sm': 'bounce 0.6s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'float-up': 'float-up 1s ease-out forwards',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-50px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 12px 24px rgba(108, 99, 255, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
