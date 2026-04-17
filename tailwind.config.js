/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06111f",
        panel: "#0a1727",
        line: "#18324b",
        glow: "#d97706",
        alert: "#f59e0b",
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 6, 23, 0.45)",
        glow: "0 0 0 1px rgba(217, 119, 6, 0.2), 0 18px 48px rgba(6, 17, 31, 0.55)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
