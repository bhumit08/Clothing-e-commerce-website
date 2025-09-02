// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // <- make sure this path is correct
  theme: {
    extend: {
      boxShadow: {
        // Blue shadow only at the bottom
        'bottom-blue': '0 15px 20px -5px rgba(59, 130, 246, 0.6)', // blue-500
      },
    },
  },
  plugins: [],
};
