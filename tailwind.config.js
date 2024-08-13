/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: {
        DEFAULT: "#000",
        100: "#212529",
        200: "#4e5156",
      },
      white: "#fff",
      grey: {
        DEFAULT: "#727171",
        100: "#dadce0",
      },
      blue: {
        DEFAULT: "#0d6efd",
        100: "#1a73e8",
        200: "#1967d2",
        300: "#185abc",
        700: "#d2e3fc",
        800: "#e8f0fe",
        900: "#f2f7fe",
      },
      red: {
        DEFAULT: "#fee2e2",
        700: "#bb2d3b",
        800: "#dc3545",
        900: "#450a0a",
      },
      dark: "#212529",
      danger: "#dc3545",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      transparent: "transparent",
    },
    fontFamily: {
      sans: ["HelveticaNowDisplay", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
    screens: {
      tablet: "768px",
      desktop: "1024px",
    },
    container: {
      screens: {
        DEFAULT: "980px",
      },
      padding: {
        DEFAULT: "1rem",
      },
      center: true,
    },
  },
  plugins: [],
};
