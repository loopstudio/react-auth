import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  external: ['react', 'react/jsx-runtime'],
  output: [{ dir: 'dist', format: 'cjs' }],
  plugins: [typescript()],
};
