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

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mockOpenIdConfiguration } from '../../lib/testUtils';
import { getOAuthContext } from './oAuthContext';
import { startOidcLogin } from './startOidcLogin';

const authMetadata = mockOpenIdConfiguration();

describe('startOidcLogin', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://example.com/oidc_callback/?lang=en'),
      configurable: true,
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should redirect to the authorisation URL', async () => {
    await startOidcLogin(
      authMetadata,
      'test_client_id',
      'https://matrix.example.com',
    );

    const url = new URL(window.location.href);
    expect(url.origin + url.pathname).toBe(authMetadata.authorization_endpoint);
    expect(url.searchParams.get('client_id')).toBe('test_client_id');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('response_mode')).toBe('fragment');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('code_challenge')).toBeTruthy();
    expect(url.searchParams.get('state')).toBeTruthy();
    expect(url.searchParams.get('scope')).toBeTruthy();
    // redirect_uri should include the path but not the query params
    expect(url.searchParams.get('redirect_uri')).toBe(
      'http://example.com/oidc_callback/',
    );
  });

  it('should store OAuth context in sessionStorage', async () => {
    await startOidcLogin(
      authMetadata,
      'test_client_id',
      'https://matrix.example.com',
    );

    const oAuthContext = getOAuthContext();
    expect(oAuthContext).toEqual({
      homeserverUrl: 'https://matrix.example.com',
      issuer: authMetadata.issuer,
      clientId: 'test_client_id',
      codeVerifier: expect.any(String),
      deviceId: expect.any(String),
      state: expect.any(String),
      redirectUri: expect.any(String),
    });
  });
});
