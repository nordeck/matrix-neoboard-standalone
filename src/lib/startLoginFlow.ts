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
import { discoverClientConfig, getHomeserverUrlFromConfig } from './discovery';
import { isValidUrl } from './isValidUrl';
import { startLegacySsoLoginFlow } from './legacy';
import { fetchSsoLoginFlow } from './matrix/fetchSsoLoginFlow';
import { startOidcLoginFlow } from './oidc';

/**
 * Start a login flow to homeserver.
 * Uses a `/login` endpoint to get a supported `SSO` authentication type that
 * can be a next gen auth OIDC or Legacy API.
 * @param homeserverName Either a domain name to discover matrix client configuration or homeserver URL.
 */
export async function startLoginFlow(homeserverName: string): Promise<void> {
  // Determine homeserver url
  let homeserverUrl: string;
  if (isValidUrl(homeserverName)) {
    homeserverUrl = homeserverName;
  } else {
    const clientConfig = await discoverClientConfig(homeserverName);
    homeserverUrl = getHomeserverUrlFromConfig(clientConfig);
  }

  const ssoFlow = await fetchSsoLoginFlow(homeserverUrl);

  if (ssoFlow && ssoFlow.delegatedOidcCompatibility) {
    await startOidcLoginFlow(homeserverUrl);
  } else if (ssoFlow) {
    await startLegacySsoLoginFlow(homeserverUrl);
  } else {
    throw new Error(
      `Homeserver "m.login.sso" authentication type is not configured`,
    );
  }
}
