/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { afterEach, describe, expect, it } from 'vitest';

import type { FetchMock } from 'vitest-fetch-mock';
import { mockOidcClientConfig } from '../testUtils';
import { fetchAuthMetadata } from './fetchAuthMetadata';
const fetch = global.fetch as FetchMock;

const oidcClientConfig = mockOidcClientConfig();

describe('fetchAuthMetadata', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should fetch and return authentication metadata', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url ===
        'https://matrix.example.com/_matrix/client/unstable/org.matrix.msc2965/auth_metadata'
      ) {
        return JSON.stringify(oidcClientConfig);
      }

      if (req.url === 'https://auth.example.com/jwks') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keys: [] }),
        };
      }

      return '';
    });

    expect(await fetchAuthMetadata('https://matrix.example.com')).toEqual({
      authorization_endpoint: 'https://auth.example.com/auth',
      code_challenge_methods_supported: ['S256'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      issuer: 'https://example.com',
      registration_endpoint: 'https://auth.example.com/register',
      response_types_supported: ['code'],
      revocation_endpoint: 'https://auth.example.com/revoke',
      token_endpoint: 'https://auth.example.com/token',
      jwks_uri: 'https://auth.example.com/jwks',
      device_authorization_endpoint: 'https://auth.example.com/device',
      signingKeys: [],
    });
  });
});
