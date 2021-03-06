const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        darkPrimary: '#119A8B',
        lightPrimary: '#DEFFFB',
        shadow: '#000000d1',
      },
      animation: {
        'count-down': 'count-down 4s linear forwards',
        disappear: 'disappear 1s 4s ease-out forwards',
      },
      keyframes: {
        'count-down': {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        disappear: {
          '0%': { transform: 'translateX(-300px)' },
          '50%': { transform: 'translateX(-200px)', opacity: 0.7 },
          '75%': { transform: 'translateX(0px)', opacity: 0.3 },
          '100%': {
            transform: 'translateX(9999999999999px)',
            opacity: 0,
          },
        },
      },
      fontFamily: {
        arial: ['Arial', 'Helvetica', 'sans-serif'],
        p: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
