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

import {
  OidcClientConfig,
  OidcRegistrationClientMetadata,
  registerOidcClient as matrixRegisterOidcClient,
} from 'matrix-js-sdk';

/**
 * Register a new OIDC client.
 *
 * @param oidcClientConfig - OIDC client config
 * @returns The client ID
 */
export async function registerOidcClient(
  oidcClientConfig: OidcClientConfig,
): Promise<string> {
  const clientUri = `${window.location.origin}${window.location.pathname}`;
  const clientMetaData: OidcRegistrationClientMetadata = {
    clientName: 'NeoBoard',
    clientUri,
    applicationType: 'web',
    redirectUris: [`${clientUri}`],
    // TODO The following values are actually required and dummies for the start.
    //      They should be made configurable.
    tosUri: clientUri,
    policyUri: clientUri,
    contacts: ['noreply@example.com'],
  };

  return await matrixRegisterOidcClient(oidcClientConfig, clientMetaData);
}
