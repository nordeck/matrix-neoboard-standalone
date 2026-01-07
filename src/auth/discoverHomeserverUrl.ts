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
import { isValidUrl } from '../lib';
import {
  discoverClientConfig,
  getHomeserverUrlFromConfig,
} from '../lib/discovery';

/**
 * Discovers a homeserver URL
 * @param homeserverName A homeserver name used to discover the URL.
 * @returns a URL discovered or undefined
 */
export async function discoverHomeserverUrl(
  homeserverName: string,
): Promise<string | undefined> {
  if (isValidUrl(homeserverName)) {
    return homeserverName;
  }

  const clientConfig = await discoverClientConfig(homeserverName);
  const homeserverUrl = getHomeserverUrlFromConfig(clientConfig);

  if (homeserverUrl) {
    return homeserverUrl;
  }

  const homeserverUrlFromName = `https://${homeserverName}`;
  if (isValidUrl(homeserverUrlFromName)) {
    return homeserverUrlFromName;
  }

  return undefined;
}
