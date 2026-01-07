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
import { MatrixError, OidcClientConfig } from 'matrix-js-sdk';
import { fetchAuthMetadata } from '../lib/discovery';
import { fetchSsoLoginFlow } from '../lib/matrix';
import { discoverHomeserverUrl } from './discoverHomeserverUrl';
import { startLegacySsoLoginFlow } from './legacy';
import { startOidcLoginFlow } from './oidc';

/**
 * Start a login flow to homeserver. Can be a next gen auth OIDC or Legacy API SSO.
 * @param homeserverName Either a domain name to discover matrix client configuration or homeserver URL.
 */
export async function startLoginFlow(homeserverName: string): Promise<void> {
  // Determine homeserver url
  const homeserverUrl = await discoverHomeserverUrl(homeserverName);
  if (!homeserverUrl) {
    throw new Error('Could not get homeserver base URL');
  }

  // Fetch the OIDC configuration
  let oidcClientConfig: OidcClientConfig | undefined;
  try {
    oidcClientConfig = await fetchAuthMetadata(homeserverUrl);
  } catch (e) {
    if (
      e instanceof MatrixError &&
      e.httpStatus === 404 &&
      e.errcode === 'M_UNRECOGNIZED'
    ) {
      oidcClientConfig = undefined;
    } else {
      throw new Error(
        'Could not determine if homeserver supports OAuth 2.0 API',
      );
    }
  }

  if (oidcClientConfig) {
    await startOidcLoginFlow(homeserverUrl, oidcClientConfig);
  } else {
    const ssoFlow = await fetchSsoLoginFlow(homeserverUrl);
    if (ssoFlow) {
      await startLegacySsoLoginFlow(homeserverUrl);
    } else {
      throw new Error(
        'OAuth 2.0 and Legacy SSO APIs are not supported by the homeserver',
      );
    }
  }
}
