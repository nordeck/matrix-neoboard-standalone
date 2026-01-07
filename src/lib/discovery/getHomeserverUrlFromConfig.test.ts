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

import { AutoDiscovery } from 'matrix-js-sdk';
import { describe, expect, it } from 'vitest';
import { getHomeserverUrlFromConfig } from './getHomeserverUrlFromConfig';

describe('getHomeserverUrlFromConfig', () => {
  it('should get homeserver URL from config', () => {
    expect(
      getHomeserverUrlFromConfig({
        'm.homeserver': {
          state: AutoDiscovery.SUCCESS,
          base_url: 'https://matrix.example.com',
        },
        'm.identity_server': {
          state: AutoDiscovery.PROMPT,
        },
      }),
    ).toBe('https://matrix.example.com');
  });

  it('should get homeserver URL from config without trailing slash', () => {
    expect(
      getHomeserverUrlFromConfig({
        'm.homeserver': {
          state: AutoDiscovery.SUCCESS,
          base_url: 'https://matrix.example.com/',
        },
        'm.identity_server': {
          state: AutoDiscovery.PROMPT,
        },
      }),
    ).toBe('https://matrix.example.com');
  });

  it('should return undefined when client config cannot be discovered', () => {
    expect(
      getHomeserverUrlFromConfig({
        'm.homeserver': {
          state: AutoDiscovery.FAIL_PROMPT,
          base_url: null,
          error: AutoDiscovery.ERROR_INVALID,
        },
        'm.identity_server': {
          state: AutoDiscovery.PROMPT,
          base_url: null,
          error: null,
        },
      }),
    ).toBeUndefined();
  });

  it('should return undefined when base_url is not found in the client config', () => {
    expect(
      getHomeserverUrlFromConfig({
        'm.homeserver': {
          state: AutoDiscovery.SUCCESS,
        },
        'm.identity_server': {
          state: AutoDiscovery.PROMPT,
        },
      }),
    ).toBeUndefined();
  });
});
