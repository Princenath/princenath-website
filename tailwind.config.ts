import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display font for headings — editorial, distinctive
        display: ["'Playfair Display'", "Georgia", "serif"],
        // Body font — clean and readable
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        // Monospace for code snippets
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Core palette
        ink: "#0A0A0A",
        paper: "#FAFAF9",
        mist: "#F4F4F2",
        smoke: "#E8E8E5",
        ash: "#9B9B96",
        // Accent — a warm amber for FinOps/cloud theme
        accent: {
          DEFAULT: "#C8873A",
          light: "#F0C080",
          dark: "#8B5A1F",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#0A0A0A",
            maxWidth: "70ch",
            "h1, h2, h3, h4": {
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: "700",
            },
            a: {
              color: "#C8873A",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            },
            code: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875em",
              backgroundColor: "#F4F4F2",
              padding: "0.2em 0.4em",
              borderRadius: "4px",
            },
          },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
