/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        skin: {
          50: '#FDFBF7',
          100: '#FAF5EE',
          200: '#F5EFEB',
          300: '#EBDDCF',
          400: '#DEC4AF',
          500: '#CFA88B',
          600: '#B08869',
          700: '#8A6448',
          800: '#674731',
          900: '#483020',
        },
        surface: {
          light: '#ffffff',
          'light-elevated': '#f5efeb',
          'light-skin': '#FAF5EE',
          dark: '#0b1120',
          'dark-elevated': '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 28px -6px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glow-indigo': '0 0 24px -4px rgba(99, 102, 241, 0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
