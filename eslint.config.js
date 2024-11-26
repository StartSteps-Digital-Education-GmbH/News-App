import { defineConfig } from 'eslint-define-config';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTypescript from '@typescript-eslint/parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Normalize __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    ignores: ['node_modules', 'dist', 'src/tests/**/*'], // Exclude tests from linting
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: path.resolve(__dirname, './tsconfig.json'), // Ensure the tsconfig path is correct
        tsconfigRootDir: __dirname,
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Disable the import/order rule completely
      'import/order': 'off',

      'prettier/prettier': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, './tsconfig.json'), // Ensure the tsconfig path is correct
        },
      },
    },
    ignores: ["dist/**", "node_modules/**", "src/tests/**"], // Ensure test files are ignored
  },
]);
