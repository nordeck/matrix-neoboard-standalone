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
import { MatrixCredentials, isValidMatrixCredentials } from '../../auth';

/**
 * Registers a guest using: https://github.com/element-hq/element-modules/tree/main/modules/restricted-guests
 * @param homeserverUrl homeserver
 * @param displayName guest display name
 */
export async function registerGuest(
  homeserverUrl: string,
  displayName: string,
): Promise<MatrixCredentials | undefined> {
  const url = new URL('/_synapse/client/register_guest', homeserverUrl);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayname: displayName }),
    });
  } catch {
    return undefined;
  }

  if (!response.ok) {
    return undefined;
  }

  let matrixCredentials: unknown;

  try {
    matrixCredentials = await response.json();
  } catch {
    return undefined;
  }

  if (!isValidMatrixCredentials(matrixCredentials)) {
    return undefined;
  }

  return matrixCredentials;
}
