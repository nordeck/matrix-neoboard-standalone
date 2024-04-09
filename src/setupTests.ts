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
