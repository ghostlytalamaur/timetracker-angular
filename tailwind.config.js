function guessProductionMode() {
  const argv = process.argv.join(' ').toLowerCase();
  const isBuild = argv.includes(' build');
  const isBuildAlias = argv.includes('ng b');
  const isFlag = argv.includes('--prod');
  const isProdEnv = process.env.NODE_ENV === 'production';

  return isBuild || isFlag || isProdEnv || isBuildAlias;
}

function colorGenerator(key, varPrefix) {
  return ({ opacityVariable, opacityValue }) => {
    console.log(opacityValue, opacityVariable);
    const colorVariable = key === 'DEFAULT' ? `var(--${varPrefix})` : `var(--${varPrefix}-${key})`;
    let colorValue;
    if (opacityValue !== undefined) {
      colorValue= `rgba(${colorVariable}, ${opacityValue})`
    } else if (opacityVariable !== undefined) {
      colorValue = `rgba(${colorVariable}, var(${opacityVariable}, 1))`
    } else {
      colorValue = `rgb(${colorVariable})`;
    }

    return colorValue;
  }
}
function colorGenerators(varPrefix) {
  const keys = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700',
    '50-contrast',
    '100-contrast',
    '200-contrast',
    '300-contrast',
    '400-contrast',
    '500-contrast',
    '600-contrast',
    '700-contrast',
    '800-contrast',
    '900-contrast',
    'A100-contrast',
    'A200-contrast',
    'A400-contrast',
    'A700-contrast',
    'lighter',
    'darker',
    'DEFAULT',
  ];

  const palette = { };
  for (const key of keys) {
    palette[key] = colorGenerator(key, varPrefix);
  }

  return palette;
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
      fontFamily: {
        sans: 'var(--tt-font-family)',
      },
      height: {
        '(screen-14)': 'calc(100vh - 3.5rem)',
        '(screen-16)': 'calc(100vh - 4rem)',
        '(screen-20)': 'calc(100vh - 5rem)',
      },
      colors: {
        'primary': colorGenerators('mat-primary'),
        'accent': colorGenerators('mat-accent'),
        'warn': colorGenerators('mat-warn'),
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
