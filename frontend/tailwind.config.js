module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridRow: {
        'span-25':'span 25 / span 25',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
