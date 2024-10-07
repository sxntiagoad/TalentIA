/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        green: {
          500: '#10B981', // Color verde para el modo empresa
        },
        purple: {
          500: '#8B5CF6', // Asegúrate de que este sea el tono de morado que estás usando
        },
      },
    },
  },
  plugins: [],
}