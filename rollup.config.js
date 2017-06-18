import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'web/js/main.js',
  format: 'cjs',
  plugins: [
    resolve(),
    babel({
      exclude: ['node_modules/**', 'web/dist/**']
    })
  ],
  dest: 'web/dist/bundle.js'
};