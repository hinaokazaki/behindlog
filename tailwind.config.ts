import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF6E3", 
        foreground: "#887A6D", // top page text color
        primary: '#55CEBA',
        secondary: '#FF917D',
        base: '#3C4A5E', // text main color
        muted: '#8E98A7', // text placeholder color
        white: '#FDFDFD',
        overlay: 'rgba(114, 114, 114, 0.5)', // modal overlay
      },
      fontSize: {
        "heading-1": ["2.5rem", { lineHeight: "3rem" }],     // 40px / 48px
        "heading-2": ["2.25rem", { lineHeight: "2.75rem" }], // 36px / 44px
        "heading-3": ["1.875rem", { lineHeight: "2.375rem" }], // 30px / 38px
        "subtitle-top": ["1.5rem", { lineHeight: "2rem" }],  // 24px / 32px
        "subtitle": ["1.25rem", { lineHeight: "2rem" }],     // 20px / 32px
        "body": ["1rem", { lineHeight: "1.75rem" }],         // 16px / 28px
        "form-text": ["0.875rem", { lineHeight: "1.75rem" }],// 14px / 28px
      }
    },
  },
  plugins: [],
};
export default config;
