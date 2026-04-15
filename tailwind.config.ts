import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50: '#e3f5ee', 100: '#c0e8d5', 500: '#1a6b52', 600: '#0f6e56', 700: '#085041', 900: '#04342c' },
        risk: { critical: '#a32d2d', 'critical-bg': '#fcebeb', moderate: '#854f0b', 'moderate-bg': '#faeeda', minor: '#3b5e0f', 'minor-bg': '#eaf3de' },
      },
    },
  },
  plugins: [],
} satisfies Config;
