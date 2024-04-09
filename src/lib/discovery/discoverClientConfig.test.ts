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
