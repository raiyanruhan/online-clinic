/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#c72929",
        "secondary": "#1F8A9E",
        "background-light": "#FAFAFA",
        "background-dark": "#201212",
        "surface-light": "#FFFFFF",
        "surface-dark": "#2d2424", // Derived from user.html for dark mode
        "text-main": "#333333",
        "text-sub": "#555555",
        "border-color": "#E5E7EB"
      },
      fontFamily: {
        "display": ["Hind Siliguri", "Inter", "sans-serif"],
        "body": ["Hind Siliguri", "Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
