module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        gray: {
          50: "#f2fbff",
          300: "#d3e1ea",
          400: "#c1c1c1",
          700: "#6c567b",
          800: "#442a55",
          900: "#2a2a2a",
          "800_02": "#442b55",
          "300_01": "#d6e3ea",
          "400_01": "#bdbdbd",
          "800_01": "#474643",
          "50_01": "#f2faff",
        },
        deep_orange: { 200: "#f8b195" },
        white: { A700: "#ffffff", A700_99: "#ffffff99" },
        red: {
          50: "#fff2ef",
          100: "#fcdacd",
          200: "#f8a1aa",
          300: "#df8561",
          "300_03": "#f67280",
          "50_02": "#ffeff1",
          "100_01": "#fdcbd0",
          "50_01": "#fff3ef",
          "100_02": "#ffd8c8",
          "300_01": "#bb5660",
          "300_02": "#c06c84",
        },
        blue_gray: {
          50: "#f1f1f1",
          100: "#ccdde7",
          300: "#95a6b0",
          "300_01": "#96a7b0",
          "100_01": "#d9d9d9",
          "100_02": "#c5d8e3",
        },
        deep_purple: { 200: "#b892d1", 300: "#9e7eb4", "200_26": "#b892d126", A200: "#785ef0", A200_01: "#9747ff" },
        purple: { 50: "#fbe3ff", 100: "#e0cdec" },
        pink: {
          200: "#e99db3",
          300: "#dc7b97",
          400: "#dc267f",
          800: "#a33d5a",
          "200_01": "#f7a0aa",
          "800_01": "#a23d5a",
          "800_02": "#a23c59",
        },
        black: { 900: "#000000" },
        orange: { A700: "#fe6100" },
        blue: { A200: "#648fff" },
        amber: { 600: "#ffb000" },
        teal: { 50: "#dbecf5", "50_01": "#daebf5" },
      },
      boxShadow: {
        xs: "0px 10px  20px 0px #00000019",
        sm: "0px 5px  20px 0px #0000000c",
        md: "0px 10px  30px 0px #0000000c",
      },
      fontFamily: { roboto: "Roboto", opensans: "Open Sans", rubik: "Rubik" },
      backgroundImage: { gradient: "linear-gradient(180deg, #fff3ef,#ffffff00)" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
