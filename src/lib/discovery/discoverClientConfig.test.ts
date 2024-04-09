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

import fetchMock from 'fetch-mock-jest';
import { AutoDiscovery } from 'matrix-js-sdk';
import { discoverClientConfig } from './discoverClientConfig';

describe('discoverClientConfig', () => {
  afterEach(() => {
    fetchMock.mockReset();
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

    expect(fetchMock).not.toHaveFetched();
  });

  it('should discover the homeserver base URL', async () => {
    fetchMock.get('https://example.com/.well-known/matrix/client', {
      'm.homeserver': { base_url: 'https://matrix.example.com' },
    });
    fetchMock.get('https://matrix.example.com/_matrix/client/versions', {
      versions: ['v1.5'],
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
