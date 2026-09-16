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

import { OAuth2 } from 'matrix-js-sdk';
import { fetchAuthMetadata } from '../../lib/discovery';
import {
  clearStoredOAuthContext,
  getStoredOAuthContext,
} from './storedOAuthContext';
import { OidcCodeAndState, OidcLoginResponse } from './types';

/**
 * Attempt to complete authorization code flow to get an access token.
 *
 * Retrieves the stored OAuth context from sessionStorage (saved during
 * startOidcLogin), fetches auth metadata from the homeserver, and
 * exchanges the authorization code for tokens.
 *
 * @param codeAndState the code and state extracted from the redirect URI.
 * @returns Promise that resolves with a OidcLoginResponse when login was successful
 * @throws When we failed to get a valid access token or stored context is missing
 */
export const completeOidcLogin = async (
  codeAndState: OidcCodeAndState,
): Promise<OidcLoginResponse> => {
  const storedContext = getStoredOAuthContext();
  if (!storedContext) {
    throw new Error('Missing stored OAuth context.');
  }

  if (storedContext.state !== codeAndState.state) {
    clearStoredOAuthContext();
    throw new Error('OAuth state mismatch.');
  }

  const authMetadata = await fetchAuthMetadata(storedContext.homeserverUrl);

  const oauth2 = new OAuth2(authMetadata, {
    clientId: storedContext.clientId,
    redirectUri: storedContext.redirectUri,
    codeVerifier: storedContext.codeVerifier,
    deviceId: storedContext.deviceId,
  });

  const tokenResponse = await oauth2.completeAuthorizationCodeGrant(
    codeAndState.code,
  );

  clearStoredOAuthContext();

  return {
    homeserverUrl: storedContext.homeserverUrl,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    clientId: storedContext.clientId,
    issuer: storedContext.issuer,
  };
};
