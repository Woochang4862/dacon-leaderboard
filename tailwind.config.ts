import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#FFFFFF"
        },
        background: {
          light: "#f5f5f5",
          dark: "#0f172a"
        },
        card: {
          light: "#ffffff",
          dark: "#1e293b"
        }
      },
      boxShadow: {
        subtle:
          "0 10px 30px -15px rgba(15, 23, 42, 0.25), 0 20px 40px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;

