// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F7490",
        secondary: "#C9AE6C",
        accent: "#8B5CF6",
        background: "#F9FAFC",
        text: "#202938",
      },
    },
  },
  corePlugins: {
    preflight: true, // keep preflight
  },
  plugins: [],
};


