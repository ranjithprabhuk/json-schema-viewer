import * as path from 'path';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

const BASE_PATH = process.cwd();

const plugins = [
  typescript({
    tsconfig: path.resolve(BASE_PATH, 'tsconfig.build.json'),
    include: ['src/**/*.{ts,tsx}'],
  }),
  terser(),
  commonjs(),
];

export default [
  {
    input: path.resolve(BASE_PATH, 'src/index.ts'),
    plugins,
    output: [
      {
        file: path.resolve(BASE_PATH, 'dist/index.cjs.js'),
        format: 'cjs',
      },
      {
        file: path.resolve(BASE_PATH, 'dist/index.es.js'),
        format: 'esm',
      },
    ],
  },
  {
    input: path.resolve(BASE_PATH, 'src/tree/index.ts'),
    plugins,
    output: [
      {
        file: path.resolve(BASE_PATH, 'dist/tree/index.js'),
        format: 'esm',
      },
    ],
  },
];
