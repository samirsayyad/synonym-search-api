import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'], // Apply to all JavaScript files
    languageOptions: { sourceType: 'commonjs' },
    ignores: ['tests/'], // Directly specify the ignore pattern
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: false, // exclude 'process'
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
  pluginJs.configs.recommended,
];
