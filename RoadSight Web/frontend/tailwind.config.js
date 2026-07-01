/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f5f4f0",
        accent: "#22c55e",
        attention: "#f97316",
        ink: "#1a1a1a",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
}

