/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        carbonic: ['"POI Carbonic"', "sans-serif"],
        suisse: ['"Suisse Intl"', "sans-serif"],
        nohemi: ["Nohemi", "sans-serif"],
      },
      colors: {
        primary: "#EB88EF",
        secondary: "#E7692C",
        accent: "#4BA5F2",
        warning: "#EFBC41",
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
