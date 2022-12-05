process.env.TAILWIND_MODE = 'watch'; // guessProductionMode() ? 'build' : 'watch';
module.exports = {
  prefix: '',
  mode: 'jit',
  darkMode: 'class',
  content: [
    './apps/**/*.{html,ts,css,scss,sass,less,styl}',
    './libs/**/*.{html,ts,css,scss,sass,less,styl}',
  ],
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
