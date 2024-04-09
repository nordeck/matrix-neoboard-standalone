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
import { AccessTokens } from 'matrix-js-sdk';
import { Credentials } from '../../state';
import {
  createMatrixTestCredentials,
  createOidcTestClientConfig,
  createOidcTestCredentials,
} from '../testUtils';
import { TokenRefresher } from './TokenRefresher';

const oidcClientConfig = createOidcTestClientConfig();

describe('TokenRefresher', () => {
  let credentials: Credentials;
  let tokenRefresher: TokenRefresher;

  beforeEach(() => {
    credentials = new Credentials();
    const oidcCredentials = createOidcTestCredentials();
    credentials.setOidcCredentials(oidcCredentials);
    const matrixCredentials = createMatrixTestCredentials();
    credentials.setMatrixCredentials(matrixCredentials);
    fetchMock.get(
      'https://example.com/.well-known/openid-configuration',
      oidcClientConfig.metadata,
    );
    fetchMock.get(oidcClientConfig.metadata.jwks_uri!, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      keys: [],
    });
    tokenRefresher = new TokenRefresher(
      oidcCredentials,
      matrixCredentials.deviceId,
      credentials,
    );
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('persistTokens should update the access tokens on the credentials', () => {
    const newTokens: AccessTokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };
    tokenRefresher.persistTokens(newTokens);

    expect(credentials.getOidcCredentials()?.accessToken).toBe(
      'new_access_token',
    );
    expect(credentials.getOidcCredentials()?.refreshToken).toBe(
      'new_refresh_token',
    );
  });
});
