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

import { Credentials } from '../../state';
import { TokenRefresher } from './TokenRefresher';
import { OidcCredentials } from './types';

/**
 * When we have a authenticated via OIDC-native flow and have a refresh token
 * try to create a token refresher.
 *
 * Borrowed from {@link https://github.com/matrix-org/matrix-react-sdk/blob/79c50db00993a97a0b6b8c3df02b8eec4e6cb21a/src/Lifecycle.ts#L746}
 *
 * @param credentials from current session
 * @returns Promise that resolves to a TokenRefresher, or undefined
 */
export async function createOidcTokenRefresher(
  credentials: Credentials,
  oidcCredentials: OidcCredentials,
  deviceId: string,
): Promise<TokenRefresher> {
  const tokenRefresher = new TokenRefresher(
    oidcCredentials,
    deviceId,
    credentials,
  );
  await tokenRefresher.oidcClientReady;
  return tokenRefresher;
}
