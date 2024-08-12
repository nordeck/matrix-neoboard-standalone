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

import { AutoDiscovery } from 'matrix-js-sdk';
import { afterEach, describe, expect, it } from 'vitest';
import type { FetchMock } from 'vitest-fetch-mock';
import { discoverClientConfig } from './discoverClientConfig';
const fetch = global.fetch as FetchMock;

describe('discoverClientConfig', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should return a URL as it is without issuing a request', async () => {
    expect(await discoverClientConfig('https://example.com')).toEqual({
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: 'https://example.com',
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    });

    expect(fetch.requests().length).toEqual(0);
  });

  it('should discover the homeserver base URL', async () => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/matrix/client') {
        return JSON.stringify({
          'm.homeserver': { base_url: 'https://matrix.example.com' },
        });
      } else if (
        req.url === 'https://matrix.example.com/_matrix/client/versions'
      ) {
        return JSON.stringify({ versions: ['v1.5'] });
      }
      return '';
    });

    expect(await discoverClientConfig('example.com')).toEqual({
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: 'https://matrix.example.com',
        error: null,
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
        base_url: null,
        error: null,
      },
    });
  });
});
