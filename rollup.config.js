const pkg = require('./package.json');
const year = (new Date()).getFullYear();

export default {
  input: 'src/smoothscroll.js',
  output: {
    file: 'dist/smoothscroll.js',
    format: 'iife'
  },
  globals: [
    'window'
  ],
  indent: true,
  strict: false,
  banner: `/* ${ pkg.title } v${ pkg.version } - ${ year } - Dustan Kasten, Jeremias Menichelli - MIT License */`
};
