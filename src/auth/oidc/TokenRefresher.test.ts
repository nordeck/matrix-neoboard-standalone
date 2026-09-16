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

import { AccessTokens } from 'matrix-js-sdk';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  mockMatrixCredentials,
  mockOidcCredentials,
  mockOpenIdConfiguration,
} from '../../lib/testUtils';
import { Credentials } from '../../state';
import { TokenRefresher } from './TokenRefresher';

import type { FetchMock } from 'vitest-fetch-mock';
import { createOidcTokenRefresher } from './createOidcTokenRefresher';
const fetch = global.fetch as FetchMock;

const openIdConfiguration = mockOpenIdConfiguration();

describe('TokenRefresher', () => {
  let credentials: Credentials;
  let tokenRefresher: TokenRefresher;

  afterEach(() => {
    fetch.resetMocks();
  });

  beforeEach(async () => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://matrix.example.com/_matrix/client/versions') {
        return JSON.stringify({
          versions: ['v1.1', 'v1.15'],
          unstable_features: {},
        });
      }

      if (
        req.url === 'https://matrix.example.com/_matrix/client/v1/auth_metadata'
      ) {
        return JSON.stringify(openIdConfiguration);
      }

      return '';
    });

    credentials = new Credentials();
    const oidcCredentials = mockOidcCredentials();
    credentials.setOidcCredentials(oidcCredentials);
    const matrixCredentials = mockMatrixCredentials();
    credentials.setMatrixCredentials(matrixCredentials);

    tokenRefresher = await createOidcTokenRefresher(
      credentials,
      oidcCredentials,
      matrixCredentials.deviceId,
      matrixCredentials.homeserverUrl,
    );
  });

  it('doRefreshAccessToken should update the access tokens on the credentials', async () => {
    // Mock the token endpoint to return new tokens
    fetch.mockResponse((req) => {
      if (req.url === openIdConfiguration.token_endpoint) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: 'new_access_token',
            refresh_token: 'new_refresh_token',
            token_type: 'Bearer',
          }),
        };
      }
      return '';
    });

    const newTokens: AccessTokens =
      await tokenRefresher.doRefreshAccessToken('test_refresh_token');

    expect(newTokens).toMatchObject({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    });
    expect(credentials.getMatrixCredentials()?.accessToken).toBe(
      'new_access_token',
    );
    expect(credentials.getMatrixCredentials()?.refreshToken).toBe(
      'new_refresh_token',
    );
  });
});
