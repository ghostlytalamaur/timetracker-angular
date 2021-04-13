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
  important: '#app',
  mode: 'jit',
  purge: {
    content: [
      './apps/**/*.{html,ts,css,scss,sass,less,styl}',
      './libs/**/*.{html,ts,css,scss,sass,less,styl}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '(screen-14)': 'calc(100vh - 3.5rem)',
        '(screen-16)': 'calc(100vh - 4rem)',
        '(screen-20)': 'calc(100vh - 5rem)',
      },
      colors: {
        bg: 'var(--mat-color-bg)',
        'fg-text': 'var(--mat-color-fg-text)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
