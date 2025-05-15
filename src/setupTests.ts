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
import { afterEach, beforeAll, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

// Import React specifically for test environment setup
import React from 'react';

// Configure React for testing environment
// Configure globals needed for React 18
beforeAll(() => {
  // Ensure React is properly initialized for the test environment
  globalThis.React = React;

  // Set up proper environment for React hooks
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.scrollTo = vi.fn();
  window.scrollTo = vi.fn();

  // React 18 requires this for concurrent features
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

  // Force React to use the same copy throughout tests
  vi.mock('react', async () => {
    const actual = await vi.importActual('react');
    return actual;
  });
});

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

// @ts-expect-error This is a polyfill for pdfjs in neoboard
// This exists since nodejs only supports this from node 22 onwards and the DOM from jsdom does not provide this either yet.
// See also https://github.com/mozilla/pdf.js/issues/18006 and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
window.Promise.withResolvers = function () {
  let res, rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  return { promise, resolve: res, reject: rej };
};
