/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prosperity Leaders™ Original Brand Colors
        'picton-blue': '#00AAFF',
        'polynesian-blue': '#1B4C87',
        'anti-flash-white': '#E5E8ED',
        
        // New SaaS Style Colors
        'primary-bg': '#1C1F2A',
        'primary-cta': '#3AA0FF',
        'secondary-cta': '#26B4A3',
        'bg-light': '#F5F7FA',
        'text-main': '#2E2E2E',
        'ui-divider': '#E0E6ED',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}