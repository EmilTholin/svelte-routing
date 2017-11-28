import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import livereload from 'rollup-plugin-livereload';
import buble from 'rollup-plugin-buble';

export default {
  input: 'main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    svelte({
      hydratable: true
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    replace({ 'process.env.NODE_ENV': '"production"' }),
    buble(),
    livereload({ watch: 'dist' })
  ]
};
