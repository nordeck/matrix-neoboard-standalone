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
import { clearOAuthContext, getOAuthContext } from './oAuthContext';
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
  const oAuthContext = getOAuthContext();
  if (!oAuthContext) {
    throw new Error('Missing stored OAuth context.');
  }

  if (oAuthContext.state !== codeAndState.state) {
    clearOAuthContext();
    throw new Error('OAuth state mismatch.');
  }

  const authMetadata = await fetchAuthMetadata(oAuthContext.homeserverUrl);

  const oauth2 = new OAuth2(authMetadata, {
    clientId: oAuthContext.clientId,
    codeVerifier: oAuthContext.codeVerifier,
    deviceId: oAuthContext.deviceId,
  });

  const tokenResponse = await oauth2.completeAuthorizationCodeGrant(
    codeAndState.code,
    oAuthContext.redirectUri,
  );

  clearOAuthContext();

  return {
    homeserverUrl: oAuthContext.homeserverUrl,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    clientId: oAuthContext.clientId,
    issuer: oAuthContext.issuer,
  };
};
