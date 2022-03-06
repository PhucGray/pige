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
        'count-down': 'count-down 5s linear',
      },
      keyframes: {
        'count-down': {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
