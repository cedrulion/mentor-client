/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily:{
        Ubuntu:['Ubuntu'],
        Interi:['Inter'],
        Roboto:['Roboto'],
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

