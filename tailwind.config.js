/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso diz ao Tailwind para ler TUDO dentro de SRC
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
