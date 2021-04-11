function guessProductionMode() {
  const argv = process.argv.join(' ').toLowerCase();
  const isBuild = argv.includes(' build');
  const isBuildAlias = argv.includes('ng b');
  const isFlag = argv.includes('--prod');
  const isProdEnv = process.env.NODE_ENV === 'production';

  return isBuild || isFlag || isProdEnv || isBuildAlias;
}

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  prefix: '',
  mode: 'jit',
  purge: {
    content: [
      './apps/**/*.{html,ts,css,scss,sass,less,styl}',
      './libs/**/*.{html,ts,css,scss,sass,less,styl}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
