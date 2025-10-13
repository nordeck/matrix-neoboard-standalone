// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
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
