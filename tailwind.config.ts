import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/layout/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      Switzer: ["Switzer"],
      SwitzerLight: ["SwitzerLight"],
      SwitzerMedium: ["SwitzerMedium"],
      SwitzerBold: ["SwitzerBold"],
      WendyOne: ["WendyOne"],
    },
    screens: {
      xs: "300px",
      sm: "450px",
      md: "600px",
      mdd: "768px",
      lg: "1025px",
      lgg: "1150px",
      xl: "1280px",
      "2xl": "1600px",
    },
    colors: {
      yellow: "#FCD436",
      green: "#04C159",
      white: "#ffffff",
      black: "#000000",
      first: "#12122A",
      gray: "#F6F6F6",
      dayL1: "var(--Day-L1)",
      dayT1: "var(--Day-T1)",
      dayT2: "var(--Day-T2)",
      dayT3: "var(--Day-T3)",
      dayBg1: "var(--Day-BG1)",
      dayBg3: "var(--Day-BG3)",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "10": "10px",
        "14": "14px",
        "16": "16px",
        "20": "20px",
        "22": "22px",
        "25": "25px",
        "50": "50px",
        "60": "60px",
        ms: "10px",
      },
      boxShadow: {
        custom:
          "0px 0px 3px 0px rgba(0, 0, 0, 0.05), 0px 12px 56px 0px rgba(0, 0, 0, 0.08)",
        tokenTrade:
          "-1px 0px 0.6px 0px rgba(0, 0, 0, 0.25) inset, 1px 1px 1px 0px #FFF inset",
      },
      colors: {
        customGrey: "#7646E6",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        buy: {
          from: "#35DA7F",
          to: "#1BC065",
        },
        sell: {
          from: "#F36684",
          to: "#DF3D5F",
        },
      },
      keyframes: {
        marquee: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(-420px)",
          },
        },
      },
      animation: {
        marquee: "marquee 5s linear ",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
