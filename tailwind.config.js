module.exports = {
  purge: {
    enabled: false,
    content: [
      './apps/**/*.html',
      './apps/**/*.ts',
      './apps/**/*.scss',
      './apps/**/*.css',
      './libs/**/*.html',
      './libs/**/*.ts',
      './libs/**/*.scss',
      './libs/**/*.css',
    ],
    // PurgeCSS options
    // Reference: https://purgecss.com/
    options: {
      rejected: true,
      printRejected: true,
    },
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
