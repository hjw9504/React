/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // class 기반으로 다크 모드 지원
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
