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

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  mockOidcClientConfig,
  mockOpenIdConfiguration,
} from '../../lib/testUtils';
import { startOidcLogin } from './startOidcLogin';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const openIdConfiguration = mockOpenIdConfiguration();
const oidcClientConfig = mockOidcClientConfig();

describe('startOidcLogin', () => {
  beforeAll(() => {
    // Add a path and a query param
    Object.defineProperty(window, 'location', {
      value: new URL('http://example.com/oidc_callback/?lang=en'),
      configurable: true,
    });

    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(openIdConfiguration),
        };
      }
      return '';
    });
  });

  afterAll(() => {
    fetch.resetMocks();
  });

  it('should redirect to the authorisation URL', async () => {
    await startOidcLogin(
      oidcClientConfig,
      'test_client_id',
      'https://matrix.example.com',
    );

    // The redirect_uri should include the path but not the query params
    expect(window.location.href).toMatch(
      /^https:\/\/auth\.example\.com\/auth\?client_id=test_client_id&redirect_uri=http%3A%2F%2Fexample\.com%2Foidc_callback%2F&response_type=code&scope=openid\+urn%3Amatrix%3Aorg\.matrix\.msc2967\.client%3Aapi%3A\*\+urn%3Amatrix%3Aorg\.matrix\.msc2967\.client%3Adevice%3A.+&nonce=.+&state=.+&code_challenge=.+&code_challenge_method=S256&response_mode=query/,
    );
  });
});
