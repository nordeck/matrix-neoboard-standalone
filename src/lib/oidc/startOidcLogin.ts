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

import { OidcClientConfig, generateOidcAuthorizationUrl } from 'matrix-js-sdk';
import { randomString } from '..';

/**
 * Start OIDC authorization code flow
 * Generates auth params, stores them in session storage and
 * Navigates to configured authorization endpoint
 *
 * Borrowed from {@link https://github.com/matrix-org/matrix-react-sdk/blob/79c50db00993a97a0b6b8c3df02b8eec4e6cb21a/src/utils/oidc/authorize.ts#L36}
 *
 * @param delegatedAuthConfig from discovery
 * @param clientId this client's id as registered with configured issuer
 * @param homeserverUrl target homeserver
 * @param identityServerUrl OPTIONAL target identity server
 * @returns Promise that resolves after we have navigated to auth endpoint
 */
export async function startOidcLogin(
  clientConfig: OidcClientConfig,
  clientId: string,
  homeserverUrl: string,
  identityServerUrl?: string,
  isRegistration?: boolean,
): Promise<void> {
  const redirectUri = `${location.protocol}//${location.host}${location.pathname}`;
  const nonce = randomString(10);
  const prompt = isRegistration ? 'create' : undefined;

  const authorizationUrl = await generateOidcAuthorizationUrl({
    metadata: clientConfig.metadata,
    redirectUri,
    clientId,
    homeserverUrl,
    identityServerUrl,
    nonce,
    prompt,
    urlState: '',
  });

  window.location.href = authorizationUrl;
}
