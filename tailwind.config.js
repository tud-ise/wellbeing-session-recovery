/* eslint-disable */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge:
    (
      (process.env.npm_lifecycle_script || "").match(
        new RegExp("^preact build")
      ) || []
    ).length > 0
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
