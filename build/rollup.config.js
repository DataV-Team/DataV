import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'build/entry.js',
  // input: 'src/index.js',
  output: {
    format: 'umd',
    file: 'dist/datav.map.js',
    name: 'datav'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    vue(),
  ],
  external: ['Vue']
}