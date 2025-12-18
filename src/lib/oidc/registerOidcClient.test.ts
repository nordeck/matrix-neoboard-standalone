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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockOidcClientConfig, mockOpenIdConfiguration } from '../testUtils';
import { registerOidcClient } from './registerOidcClient';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const openIdConfiguration = mockOpenIdConfiguration();
const oidcClientConfig = mockOidcClientConfig();

describe('registerOidcClient', () => {
  beforeEach(() => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return JSON.stringify(openIdConfiguration);
      }
      return '';
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should register an OIDC client', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url === 'https://auth.example.com/register' &&
        req.method === 'POST' &&
        req.headers.get('Content-Type') === 'application/json'
      ) {
        const expectedBody = {
          client_name: 'NeoBoard',
          client_uri: 'http://example.com/',
          response_types: ['code'],
          grant_types: ['authorization_code', 'refresh_token'],
          redirect_uris: ['http://example.com/'],
          id_token_signed_response_alg: 'RS256',
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          contacts: ['noreply@example.com'],
          policy_uri: 'http://example.com/',
          tos_uri: 'http://example.com/',
        };
        // Arrays in the parsed body are behaving weirdly, so we need to compare the stringified body
        if (req.body?.toString() === JSON.stringify(expectedBody)) {
          return {
            body: JSON.stringify({
              client_id: 'test_client_id',
            }),
          };
        }
      }
      return '';
    });

    expect(await registerOidcClient(oidcClientConfig)).toBe('test_client_id');
  });
});
