const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', "node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        // set primary color from figma
        // primary: {
        // },
      },
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.5rem',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],

};