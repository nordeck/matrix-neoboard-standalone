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

import { fetchAuthMetadata } from '../../lib/discovery';
import { Credentials } from '../../state';
import { TokenRefresher } from './TokenRefresher';
import { OidcCredentials } from './types';

/**
 * When we have authenticated via OAuth2/OIDC-native flow and have a refresh
 * token, create a token refresher.
 *
 * Fetches auth metadata from the homeserver to construct the OAuth2 context
 * needed for token refresh.
 *
 * @param credentials from current session
 * @param oidcCredentials OIDC credentials with issuer and client info
 * @param deviceId the device ID for this session
 * @param homeserverUrl the homeserver URL to fetch auth metadata from
 * @returns Promise that resolves to a TokenRefresher
 */
export async function createOidcTokenRefresher(
  credentials: Credentials,
  oidcCredentials: OidcCredentials,
  deviceId: string,
  homeserverUrl: string,
): Promise<TokenRefresher> {
  const authMetadata = await fetchAuthMetadata(homeserverUrl);
  return new TokenRefresher(
    authMetadata,
    oidcCredentials,
    deviceId,
    credentials,
  );
}
