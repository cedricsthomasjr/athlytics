module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        gradient: "gradient 4s ease infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
    darkTheme: "dark",
  },
};
