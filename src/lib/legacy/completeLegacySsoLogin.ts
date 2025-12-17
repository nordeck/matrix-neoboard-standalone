/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { createClient, LoginResponse } from 'matrix-js-sdk';

/**
 * Login with token
 * @param homeserverUrl
 * @param loginToken
 * @return login response with access token, user id, etc or undefined in case of error
 */
export async function completeLegacySsoLogin({
  homeserverUrl,
  loginToken,
}: {
  homeserverUrl: string;
  loginToken: string;
}): Promise<LoginResponse | undefined> {
  const matrixClient = createClient({
    baseUrl: homeserverUrl,
  });

  try {
    return await matrixClient.loginRequest({
      token: loginToken,
      type: 'm.login.token',
    });
  } catch (error) {
    console.warn('Completing legacy SSO login failed', error);
    return undefined;
  }
}
