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

import { MatrixClient, MatrixScheduler, MemoryStore } from 'matrix-js-sdk';
import { OidcCredentials, TokenRefresher } from '../../lib/oidc';
import { MatrixCredentials } from '../Credentials';

export async function createMatrixClient(
  oidcCredentials: OidcCredentials,
  matrixCredentials: MatrixCredentials,
  tokenRefresher?: TokenRefresher,
): Promise<MatrixClient> {
  return new MatrixClient({
    baseUrl: oidcCredentials.homeserverUrl,
    accessToken: oidcCredentials.accessToken,
    // use native fetch API
    fetchFn: fetch.bind(window),
    userId: matrixCredentials.userId,
    deviceId: matrixCredentials.deviceId,
    refreshToken: oidcCredentials.refreshToken,
    tokenRefreshFunction:
      tokenRefresher?.doRefreshAccessToken.bind(tokenRefresher),
    // create a store to save sync data to be requested by the api endpoints
    store: new MemoryStore({
      localStorage: global.localStorage,
    }),
    // create a scheduler (created by createClient from matrix-js-sdk)
    scheduler: new MatrixScheduler(),
  });
}
