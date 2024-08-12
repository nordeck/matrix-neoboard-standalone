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

module.exports = {
  plugins: ['promise', 'notice'],
  extends: [
    'react-app',
    'plugin:promise/recommended',
    'eslint:recommended',
    'prettier',
  ],
  rules: {
    'notice/notice': [
      'error',
      {
        templateFile: 'scripts/license-header.txt',
        onNonMatchingHeader: 'replace',
        templateVars: { NAME: 'Nordeck IT + Consulting GmbH' },
        varRegexps: { NAME: /.+/ },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
  },
};
