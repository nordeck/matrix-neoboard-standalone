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

import { OAuth2, ValidatedAuthMetadata } from 'matrix-js-sdk';
import { secureRandomString } from 'matrix-js-sdk/lib/randomstring';
import { setOAuthContext } from './oAuthContext';

/**
 * Start OAuth2 authorization code flow.
 * Creates an OAuth2 instance, stores context in sessionStorage,
 * and navigates to the authorization endpoint.
 *
 * @param authMetadata - validated auth metadata from discovery
 * @param clientId - this client's id as registered with the issuer
 * @param homeserverUrl - target homeserver
 * @returns Promise that resolves after we have navigated to auth endpoint
 */
export async function startOidcLogin(
  authMetadata: ValidatedAuthMetadata,
  clientId: string,
  homeserverUrl: string,
): Promise<void> {
  const redirectUri = `${location.protocol}//${location.host}${location.pathname}`;
  const state = secureRandomString(16);

  const oauth2 = new OAuth2(authMetadata, {
    clientId,
    redirectUri,
  });
  setOAuthContext({
    homeserverUrl,
    issuer: authMetadata.issuer,
    clientId: oauth2.context.clientId,
    redirectUri: oauth2.context.redirectUri,
    codeVerifier: oauth2.context.codeVerifier,
    deviceId: oauth2.context.deviceId,
    state,
  });

  const authorizationUrl = await oauth2.generateAuthorizationCodeGrantUrl(
    state,
    'fragment',
  );

  window.location.href = authorizationUrl;
}
