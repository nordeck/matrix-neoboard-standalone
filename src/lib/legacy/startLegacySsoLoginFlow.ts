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

import { MatrixClient } from 'matrix-js-sdk';

export const legacySsoHomeserverUrlStorageKey = 'nd_legacy_sso_homeserverUrl';

/**
 * Starts the SSO login flow via Legacy API for a given homeserver.
 *
 * @param homeserverUrl - Homeserver domain name or URL.
 */
export async function startLegacySsoLoginFlow(
  homeserverUrl: string,
): Promise<void> {
  const matrixClient = new MatrixClient({
    baseUrl: homeserverUrl,
  });
  const redirectUrl = `${window.location.origin}${window.location.pathname}`;
  const ssoLoginUrl = matrixClient.getSsoLoginUrl(redirectUrl, 'sso');

  localStorage.setItem(legacySsoHomeserverUrlStorageKey, homeserverUrl);

  window.location.href = ssoLoginUrl;
}
