/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard Standalone is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * NeoBoard Standalone is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard Standalone. If not, see <https://www.gnu.org/licenses/>.
 */

import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import notice from 'eslint-plugin-notice';
import pluginPromise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from 'eslint-plugin-vitest';
import path from 'path';
import ts from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default ts.config(
  {
    ignores: [
      '**/__mocks__/**',
      '**/build/**',
      '**/coverage/**',
      '**/*test.ts.snap',
    ],
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  {
    plugins: {
      notice,
    },
    rules: {
      'notice/notice': [
        'error',
        {
          templateFile: path.resolve(__dirname, './scripts/license-header.txt'),
          onNonMatchingHeader: 'replace',
          templateVars: { NAME: 'Nordeck IT + Consulting GmbH' },
          varRegexps: { NAME: /.+/ },
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      // Disable for the migration to prevent a lot of errors.
      // Should be revisisted
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // Allow unused vars starting with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ...react.configs.flat.recommended,
    rules: {
      ...react.configs.flat.recommended.rules,
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      // Disabled to avoid weird error messages
      // https://github.com/jsx-eslint/eslint-plugin-react/issues?q=is%3Aissue+is%3Aopen+forwardRef
      'react/prop-types': 'off',
      // Disabled because it would conflict with removing unused imports
      'react/react-in-jsx-scope': 'off',
    },
  },
  // Test-specific configuration
  {
    files: ['**/*.test.*'],
    plugins: {
      vitest,
      // See https://github.com/testing-library/eslint-plugin-testing-library/issues/899#issuecomment-2121272355 and
      // https://github.com/testing-library/eslint-plugin-testing-library/issues/924
      'testing-library': fixupPluginRules({
        rules: testingLibrary.rules,
      }),
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/display-name': 'off',
    },
  },
  eslintConfigPrettier,
);
