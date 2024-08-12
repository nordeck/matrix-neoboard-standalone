/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import crypto from 'crypto';
import { TextDecoder, TextEncoder } from 'util';
import { afterEach, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import './i18n';
import { setLocale } from './lib/locale';

// Use a different configuration for i18next during tests
vi.mock('./i18n', () => {
  const i18n = require('i18next');
  const { initReactI18next } = require('react-i18next');

  i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: { en: {} },
  });

  return i18n;
});
setLocale('en');

// Mock i18next's t to fix loading of translations
vi.mock('i18next', async () => ({
  ...(await vi.importActual('i18next')),
  t: (key: string, fallback: string) => fallback,
}));

// Set up parts of the crypto API needed for the tests
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: crypto.getRandomValues,
    subtle: crypto.webcrypto.subtle,
  },
});

// Publish TextEncoder and TextDecoder in the global scope
Object.assign(global, { TextDecoder, TextEncoder });

// Set the window location to 'https://example.com'
Object.defineProperty(window, 'location', {
  value: new URL('http://example.com'),
  configurable: true,
});

// Mock the fetch API
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

afterEach(() => {
  cleanup();
});
