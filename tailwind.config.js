/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: {
        DEFAULT: "#000",
        100: "#212529",
      },
      white: "#fff",
      blue: {
        DEFAULT: "#0d6efd",
        100: "#1fb6ff",
      },
      red: {
        DEFAULT: "#fee2e2",
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
      sans: ["Graphik", "sans-serif"],
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
  },
  plugins: [],
};
