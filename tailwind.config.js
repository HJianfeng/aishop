/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    screens: {
      small: { min: '0', max: '1200px' },
    },
    extend: {
      colors: {
        primary: '#6884FF',
        primaryhover: '#5F88FF',
        primaryBtn: '#6884FF'
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

