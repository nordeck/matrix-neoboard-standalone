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
