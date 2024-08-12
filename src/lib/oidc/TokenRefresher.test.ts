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

import { AccessTokens } from 'matrix-js-sdk';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Credentials } from '../../state';
import {
  createMatrixTestCredentials,
  createOidcTestClientConfig,
  createOidcTestCredentials,
} from '../testUtils';
import { TokenRefresher } from './TokenRefresher';

import type { FetchMock } from 'vitest-fetch-mock';
import { createOidcTokenRefresher } from './createOidcTokenRefresher';
const fetch = global.fetch as FetchMock;

const oidcClientConfig = createOidcTestClientConfig();

describe('TokenRefresher', () => {
  let credentials: Credentials;
  let tokenRefresher: TokenRefresher;

  afterEach(() => {
    fetch.resetMocks();
  });

  beforeEach(async () => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(oidcClientConfig.metadata),
        };
      } else if (req.url === oidcClientConfig.metadata.jwks_uri!) {
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

    credentials = new Credentials();
    const oidcCredentials = createOidcTestCredentials();
    credentials.setOidcCredentials(oidcCredentials);
    const matrixCredentials = createMatrixTestCredentials();
    credentials.setMatrixCredentials(matrixCredentials);

    tokenRefresher = await createOidcTokenRefresher(
      credentials,
      oidcCredentials,
      matrixCredentials.deviceId,
    );
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
