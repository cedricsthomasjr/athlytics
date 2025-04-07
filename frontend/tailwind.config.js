module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
      },
      fontFamily: {
        // Adding custom font family 'Inter' here
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"], // Only use the dark theme
    darkTheme: "dark",
  },
};
