/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          forest: "#245B45",
          leaf: "#6F9477",
          sage: "#DCE8D9",
          cream: "#F6F4EC",
          terracotta: "#C87552",
          dark: "#26352C",
          moss: "#345C41",
          earth: "#7D5340",
          lightCream: "#FCFBF7",
          cardBg: "#FFFFFF",
          border: "#E2DEC9"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 91, 69, 0.08)',
        'card': '0 2px 12px -1px rgba(38, 53, 44, 0.06)',
        'elevated': '0 12px 30px -4px rgba(36, 91, 69, 0.12)'
      }
    },
  },
  plugins: [],
}
