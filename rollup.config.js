import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  sourceMap: true,
  moduleName: '_',
  format: 'umd',
  plugins: [babel() ],
  dest: 'underscore.js'
};