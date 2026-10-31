/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Medeo Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        glance: {
          bg: '#fbfaff',
          card: 'rgba(255, 255, 255, 0.72)',
          cardHover: 'rgba(255, 255, 255, 0.88)',
          glass: 'rgba(247, 245, 253, 0.65)',
          border: 'rgba(226, 220, 240, 0.7)',
          accent: '#6e56cf',
          accentLight: '#f1edfd',
          accentDark: '#533db5',
          textMain: '#1e1b38',
          textMuted: '#6d6a8b',
          p1: '#ef4444',
          p1Bg: '#fef2f2',
          p2: '#f59e0b',
          p2Bg: '#fffbeb',
          p3: '#8b88a8',
          p3Bg: '#f4f3f9'
        }
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(100, 75, 160, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)',
        'float': '0 14px 40px rgba(90, 65, 150, 0.12), 0 3px 10px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(110, 86, 207, 0.28)',
      }
    },
  },
  plugins: [],
}
