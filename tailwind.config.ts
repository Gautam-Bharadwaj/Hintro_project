import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        text: "var(--color-text)",
        "text-soft": "var(--color-text-soft)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-soft": "var(--color-primary-soft)",
        accent: "var(--color-accent)",
        "stat-red": "var(--color-stat-red)",
        "stat-teal": "var(--color-stat-teal)",
        "stat-green": "var(--color-stat-green)",
        "stat-purple": "var(--color-stat-purple)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        modal: "var(--shadow-modal)",
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
    },
  },
  plugins: [],
};
export default config;
