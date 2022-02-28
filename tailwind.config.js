module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        darkPrimary: '#119A8B',
        lightPrimary: '#DEFFFB',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
