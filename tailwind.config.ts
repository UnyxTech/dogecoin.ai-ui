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
      second: "#8989AB",
      gray: "#F6F6F6",
      dayL1: "var(--Day-L1)",
      dayT1: "var(--Day-T1)",
      dayT2: "var(--Day-T2)",
      dayT3: "var(--Day-T3)",
      dayT4: "var(--Day-T4)",
      dayBg1: "var(--Day-BG1)",
      dayBg3: "var(--Day-BG3)",
      border: "#EBEBF4",
      red: "#EB4B6D",
      hover: "#F5F5FA",
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
        "12": "12px",
        "14": "14px",
        "16": "16px",
        "20": "20px",
        "22": "22px",
        "24": "24px",
        "25": "25px",
        "50": "50px",
        "60": "60px",
        ms: "10px",
      },
      boxShadow: {
        custom:
          "0px 0px 3px 0px rgba(0, 0, 0, 0.05), 0px 12px 56px 0px rgba(0, 0, 0, 0.08)",
        grayShadow:
          "0px 0px 0.225px 0.225px rgba(0, 0, 0, 0.07), 0px 0px 0.225px 0.675px rgba(0, 0, 0, 0.05), 0px 2.698px 2.923px -1.349px rgba(0, 0, 0, 0.25), 0px 0.899px 3.598px 0.899px rgba(0, 0, 0, 0.12), 0px 0px 0px 4px #F2F2F2",
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
      backgroundImage: {
        "linear-yellow":
          "linear-gradient(7deg, #FCD436 22.18%, #FFE478 70.41%)",
        "linear-green":
          "linear-gradient(194deg, #68F5A7 -9.05%, #04C159 51.88%)",
        "linear-red":
          "linear-gradient(194deg, #FF8FA6 -9.05%, #EB4B6D 51.88%);",
        "linear-pink":
          "linear-gradient(194deg, #FF8FA6 -9.05%, #EB4B6D 51.88%)",
        "linear-white": "linear-gradient(180deg, #F4F4F4 0%, #FEFEFE 100%)",
        "linear-gray": "linear-gradient(180deg, #F5F5FA 0%, #DADADE 100%)",
        "hover-yellow":
          "linear-gradient(7deg, rgba(252, 212, 54, 0.50) 22.18%, rgba(255, 228, 120, 0.50) 70.41%)",
        "hover-green":
          "linear-gradient(194deg, rgba(104, 245, 167, 0.50) -9.05%, rgba(4, 193, 89, 0.50) 51.88%)",
        "hover-red":
          "linear-gradient(194deg, rgba(255, 143, 166, 0.50) -9.05%, rgba(235, 75, 109, 0.50) 51.88%)",
        "hover-pink":
          "linear-gradient(194deg, rgba(255, 143, 166, 0.50) -9.05%, rgba(235, 75, 109, 0.50) 51.88%)",
        "user-detail": "linear-gradient(180deg, #F4F4F4 0%, #FFF 100%)",
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
