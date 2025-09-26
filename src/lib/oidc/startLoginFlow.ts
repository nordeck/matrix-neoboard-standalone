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

import { discoverAndValidateOIDCIssuerWellKnown } from 'matrix-js-sdk';
import { ensureNoTrailingSlash } from 'matrix-js-sdk/lib/utils';
import { discoverClientConfig, fetchAuthIssuer } from '../discovery';
import { registerOidcClient, startOidcLogin } from './';

/**
 * Starts the OIDC login flow for a given homeserver.
 *
 * @param homeserverName - The name of the homeserver to login to
 * @throws Error if the login process fails at any step
 */
export async function startLoginFlow(homeserverName: string): Promise<void> {
  // Find the homeserver's base URL
  const clientConfig = await discoverClientConfig(homeserverName);
  const rawBaseUrl = clientConfig['m.homeserver'].base_url;

  if (rawBaseUrl === undefined || rawBaseUrl === null) {
    throw new Error('Login failed. Check your homeserver name.');
  }

  const baseUrl = ensureNoTrailingSlash(rawBaseUrl);

  // Fetch the auth issuer, to find out where the actual authentication is performed
  const { issuer } = await fetchAuthIssuer(baseUrl);

  // Fetch the OIDC configuration from the auth issuer
  const oidcClientConfig = await discoverAndValidateOIDCIssuerWellKnown(issuer);

  // Register an OIDC client and start the authentication
  const clientId = await registerOidcClient(oidcClientConfig);
  startOidcLogin(oidcClientConfig, clientId, baseUrl);
}
