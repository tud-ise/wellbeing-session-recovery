/* eslint-disable */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge:
    process.env.npm_lifecycle_script == "preact build"
      ? {
          enabled: true,
          content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/template.html"],
        }
      : ["./src/**/*.{js,jsx,ts,tsx}", "./src/template.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
};
