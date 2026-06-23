export default {

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {

      colors: {

        primary: {
          DEFAULT: "#06b6d4",
          dark: "#0891b2",
          light: "#22d3ee",
        },

        danger: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },

        success: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },

        warning: {
          DEFAULT: "#f59e0b",
        }
      },

      boxShadow: {
        glow: "0 0 25px rgba(6,182,212,0.25)",
        danger: "0 0 25px rgba(239,68,68,0.25)",
      },

      animation: {
        pulseSlow: "pulse 3s infinite",
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-6px)",
          },
        },
      },
    },
  },

  plugins: [],
};