import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  { rules: { 'jsx-a11y/alt-text': 'error', 'jsx-a11y/anchor-has-content': 'error' } },
  globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts', 'design/**', 'public/**']),
]);
