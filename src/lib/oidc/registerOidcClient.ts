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
