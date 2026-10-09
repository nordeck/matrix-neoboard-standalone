/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
import {
  ClientEvent,
  MatrixClient,
  MatrixError,
  SyncState,
} from 'matrix-js-sdk';
import {
  Credentials,
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../Credentials';
import { createMatrixClient } from './createMatrixClient';

export async function startMatrixClient(
  credentials: Credentials,
): Promise<MatrixClient | undefined> {
  const oidcCredentials = credentials.getOidcCredentials();
  const matrixCredentials = credentials.getMatrixCredentials();

  if (matrixCredentials === null) {
    return undefined;
  }

  const matrixClient = await createMatrixClient(
    matrixCredentials,
    oidcCredentials?.clientId,
    (tokens) => credentials.updateAccessTokens(tokens),
  );

  // Send a whoami request before starting the client
  // to ensure that we can connect to the server with valid credentials.
  try {
    await matrixClient.whoami();
  } catch (error) {
    const matrixError = error as MatrixError;
    if (matrixError.name === 'M_UNKNOWN_TOKEN') {
      // An invalid token is nothing that can be recover from.
      // Clear the persisted credentials.
      localStorage.removeItem(oidcCredentialsStorageKey);
      localStorage.removeItem(matrixCredentialsStorageKey);
    }

    throw error; // Re-throw the error
  }

  const initialSyncPromise = new Promise((resolve) => {
    matrixClient.once(ClientEvent.Sync, (state) => {
      if (state === SyncState.Prepared) {
        resolve(undefined);
      } else {
        throw new Error('Cannot sync');
      }
    });
  });

  await matrixClient.startClient();

  await initialSyncPromise;

  return matrixClient;
}
