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

import crypto from 'crypto';
import fetchMock from 'fetch-mock';
import { TextDecoder, TextEncoder } from 'util';

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
Object.assign(global, {
  fetch: fetchMock.sandbox(),
});
