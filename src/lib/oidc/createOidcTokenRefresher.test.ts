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
import { Credentials } from '../../state';
import {
  mockMatrixCredentials,
  mockOidcCredentials,
  mockOpenIdConfiguration,
} from '../testUtils';
import { TokenRefresher } from './TokenRefresher';
import { createOidcTokenRefresher } from './createOidcTokenRefresher';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

describe('createOidcTokenRefresher', () => {
  const openIdConfiguration = mockOpenIdConfiguration();
  const oidcCredentials = mockOidcCredentials();
  const matrixCredentials = mockMatrixCredentials();
  const credentials = new Credentials();
  credentials.setMatrixCredentials(matrixCredentials);
  credentials.setOidcCredentials(oidcCredentials);

  beforeEach(() => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(openIdConfiguration),
        };
      } else if (req.url === openIdConfiguration.jwks_uri) {
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
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should create a TokenRefresher', async () => {
    expect(
      await createOidcTokenRefresher(
        credentials,
        oidcCredentials,
        matrixCredentials.deviceId,
      ),
    ).toBeInstanceOf(TokenRefresher);
  });
});
