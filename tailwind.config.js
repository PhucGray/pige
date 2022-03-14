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
        'count-down': 'count-down 3s linear forwards',
        disappear: 'disappear 1s 3s ease-out forwards',
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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontWeight: 'bold', fontSize: '22px' },
        h2: { fontWeight: 'bold', fontSize: '18px' },
      });
    }),
  ],
};
