/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        yellow: "#FFAC30",
        darkBlue: "#3a4276",
        defaultText: "#7B7F9E",
        blackText: "#1B1D28",
        offWhite: "#F1F3F6"
      },
      fontFamily: {
        SpaceGroteskBold: ["SpaceGrotesk-Bold"],
        SpaceGroteskLight: ["SpaceGrotesk-Light"],
        SpaceGroteskMedium: ["SpaceGrotesk-Medium"],
        SpaceGroteskRegular: ["SpaceGrotesk-Regular"],
        SpaceGroteskSemiBold: ["SpaceGrotesk-SemiBold"]
      }
    }
  },
  plugins: []
};
