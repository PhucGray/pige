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
        'count-down': 'count-down 4s linear',
        disappear: 'disappear 0.5s 4s',
      },
      keyframes: {
        'count-down': {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        disappear: {
          '0%': { transform: 'translateX(-300px)' },
          '50%': { transform: 'translateX(-200px)' },
          '75%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(100vw)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
