/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--c-ink)',
        graphite: 'var(--c-graphite)',
        gold: 'var(--c-gold)',
        champagne: 'var(--c-champagne)',
        paper: 'var(--c-paper)',
        mineral: 'var(--c-mineral)',
        line: 'var(--c-line)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Cormorant"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      transitionTimingFunction: { nord: 'cubic-bezier(0.76, 0, 0.24, 1)', out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      screens: { xs: '400px', '3xl': '1920px' },
    },
  },
  plugins: [],
};
