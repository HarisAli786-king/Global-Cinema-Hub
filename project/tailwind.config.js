/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: { black: "#050505", card: "#0f0f0f", elevated: "#1a1a1a" },
        accent: { red: "#e50914", "red-dark": "#b0060f" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bebas Neue'", "Inter", "sans-serif"],
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        expandIn: {
          "0%": { width: "0", opacity: "0" },
          "100%": { width: "16rem", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out both",
        fadeInUp: "fadeInUp 0.6s ease-out both",
        expandIn: "expandIn 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};
