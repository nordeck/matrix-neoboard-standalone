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
