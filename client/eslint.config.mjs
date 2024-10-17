import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.recommended,
  pluginJsxA11y.configs.recommended,
  {
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint,
      'react': pluginReact,
      'import': pluginImport,
      'jsx-a11y': pluginJsxA11y,
      'prettier': pluginPrettier,
    },
    rules: {
      // TypeScript Rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // React Rules
      'react/jsx-uses-react': 'off', // React 17+ does not require 'React' to be in scope
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Disable prop-types as we use TypeScript for type checking

      // Import Rules
      'import/order': [
        'warn',
        {
          'groups': [['builtin', 'external', 'internal']],
          'alphabetize': { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],

      // Accessibility Rules
      'jsx-a11y/anchor-is-valid': 'warn',

      // Code Formatting with Prettier
      'prettier/prettier': [
        'error',
        {
          'singleQuote': true,
          'semi': true,
          'trailingComma': 'all',
        },
      ],
    },
  },
];
