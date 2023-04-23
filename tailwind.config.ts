import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-josefin)", ...fontFamily.sans],
      },
    },
    colors: {
      white: "#FFFFFF",
      gunmetal: "#494C6B",
      "grayish-blue": "#9495A5",
      "light-gray": "#D1D2DA;",
      "slate-gray": "#767992",
      ming: "#4D5067",
      periwinkle: "#C8CBE7",
      "white-smoke": "#FAFAFA",
      "navy-blue": "#171823",
      cherywood: "#25273D",
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
