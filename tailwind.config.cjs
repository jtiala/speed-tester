/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Righteous", "ui-sans-serif"],
        sans: ["Rubik", "ui-sans-serif"],
      },
    },
    screens: {
      tablet: "820px",
      desktop: "1200px",
    },
  },
  plugins: [],
};
