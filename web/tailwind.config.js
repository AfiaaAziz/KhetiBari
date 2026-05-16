/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f4faf8",
          100: "#e6f2ee",
          800: "#134739",
          900: "#0f241f",
          950: "#081814",
        },
        brass: {
          400: "#ddb855",
          500: "#c9a227",
          600: "#a78316",
        },
        teal: {
          550: "#0f766e",
          650: "#0d5f59",
        },
        slate: {
          850: "#172033",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "14px",
      },
      boxShadow: {
        lift: "0 14px 40px rgba(8, 24, 20, 0.07)",
        panel: "0 1px 0 rgba(255,255,255,0.85) inset, 0 12px 36px rgba(8, 24, 20, 0.06)",
      },
    },
  },
  plugins: [],
};
