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
