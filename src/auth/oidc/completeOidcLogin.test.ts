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
import {
  mockMatrixCredentials,
  mockOidcCredentials,
  mockOpenIdConfiguration,
} from '../../lib/testUtils';
import { completeOidcLogin } from './completeOidcLogin';
import { OAuthContext } from './oAuthContext';
import { OidcCodeAndState } from './types';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const openIdConfiguration = mockOpenIdConfiguration();
const matrixCredentials = mockMatrixCredentials();
const oidcCredentials = mockOidcCredentials();

const oAuthContext: OAuthContext = {
  homeserverUrl: matrixCredentials.homeserverUrl,
  issuer: oidcCredentials.issuer,
  clientId: oidcCredentials.clientId,
  redirectUri: 'http://localhost/',
  codeVerifier: 'test_code_verifier',
  deviceId: matrixCredentials.deviceId,
  state: 'oidc_test_state',
};

describe('completeOidcLogin', () => {
  beforeEach(() => {
    sessionStorage.setItem('nd_oauth_context', JSON.stringify(oAuthContext));

    fetch.mockResponse((req) => {
      if (
        req.url === `${matrixCredentials.homeserverUrl}_matrix/client/versions`
      ) {
        return JSON.stringify({
          versions: ['v1.1', 'v1.15'],
        });
      }

      if (
        req.url ===
        `${matrixCredentials.homeserverUrl}_matrix/client/v1/auth_metadata`
      ) {
        return JSON.stringify(openIdConfiguration);
      }

      if (req.url === openIdConfiguration.token_endpoint) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: matrixCredentials.accessToken,
            refresh_token: matrixCredentials.refreshToken,
            token_type: 'Bearer',
          }),
        };
      }

      return '';
    });
  });

  afterEach(() => {
    fetch.resetMocks();
    sessionStorage.clear();
  });

  it('should exchange the code for tokens and return login response', async () => {
    const codeAndState: OidcCodeAndState = {
      state: 'oidc_test_state',
      code: 'oidc_test_code',
    };

    const result = await completeOidcLogin(codeAndState);

    expect(result.homeserverUrl).toBe(matrixCredentials.homeserverUrl);
    expect(result.accessToken).toBe(matrixCredentials.accessToken);
    expect(result.refreshToken).toBe(matrixCredentials.refreshToken);
    expect(result.clientId).toBe(oidcCredentials.clientId);
    expect(result.issuer).toBe(oidcCredentials.issuer);
  });

  it('should throw when stored OAuth context is missing', async () => {
    sessionStorage.clear();

    const codeAndState: OidcCodeAndState = {
      state: 'oidc_test_state',
      code: 'oidc_test_code',
    };

    await expect(completeOidcLogin(codeAndState)).rejects.toThrow(
      'Missing stored OAuth context',
    );
  });

  it('should clear stored context after successful login', async () => {
    const codeAndState: OidcCodeAndState = {
      state: 'oidc_test_state',
      code: 'oidc_test_code',
    };

    await completeOidcLogin(codeAndState);

    expect(sessionStorage.getItem('nd_oauth_context')).toBeNull();
  });

  it('should throw on state mismatch', async () => {
    const codeAndState: OidcCodeAndState = {
      state: 'wrong_state',
      code: 'oidc_test_code',
    };

    await expect(completeOidcLogin(codeAndState)).rejects.toThrow(
      'OAuth state mismatch',
    );

    expect(sessionStorage.getItem('nd_oauth_context')).toBeNull();
  });
});
