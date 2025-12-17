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

import { AutoDiscovery, ClientConfig } from 'matrix-js-sdk';

/**
 * Discover the client config, i.e. the homeserver base URL.
 *
 * @param domain - The homeserver domain to discover the config
 * @returns The client configuration
 */
export async function discoverClientConfig(
  domain: string,
): Promise<ClientConfig> {
  // use the native fetch API
  AutoDiscovery.setFetchFn(fetch.bind(window));

  return await AutoDiscovery.findClientConfig(domain);
}
