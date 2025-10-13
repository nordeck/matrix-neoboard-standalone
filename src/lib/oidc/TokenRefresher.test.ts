// SPDX-License-Identifier: AGPL-3.0-or-later

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
