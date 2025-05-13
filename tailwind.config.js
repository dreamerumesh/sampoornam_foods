// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{html,js}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//       extend: {},
//   },
//   plugins: [require("tailwindcss-animate")],
  
// };


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          700: "#15803d", // Adjust to match your design
        },
        red: {
          550: '#EF4444', // example custom red
        },
      }
    },
  },
  plugins: [],
}
