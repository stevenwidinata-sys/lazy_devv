/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
      },
    },
  },
  plugins: [],
}
