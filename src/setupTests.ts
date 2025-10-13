// SPDX-License-Identifier: AGPL-3.0-or-later

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
