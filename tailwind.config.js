/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "hsl(0, 0%, 5%)",
        lightDark: "hsl(0, 0%, 8%)",
        important: "hsl(0, 0%, 12%)",
        rim: "hsl(0, 0%, 12%)",
        whiteText: "hsl(0, 0%, 95%)",
        mutedText: "hsl(0, 0%, 70%)",
      },
    },
  },
  plugins: [],
};
