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

import { OidcClientConfig } from 'matrix-js-sdk';
import { registerOidcClient } from './registerOidcClient';
import { startOidcLogin } from './startOidcLogin';

/**
 * Starts the OIDC login flow for a given homeserver.
 *
 * @param homeserverUrl - The homeserver URL to login
 * @param oidcClientConfig - The oidc client config for delegated authentication
 * @throws Error if the login process fails at any step
 */
export async function startOidcLoginFlow(
  homeserverUrl: string,
  oidcClientConfig: OidcClientConfig,
): Promise<void> {
  // Register an OIDC client and start the authentication
  const clientId = await registerOidcClient(oidcClientConfig);
  await startOidcLogin(oidcClientConfig, clientId, homeserverUrl);
}
