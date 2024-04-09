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
