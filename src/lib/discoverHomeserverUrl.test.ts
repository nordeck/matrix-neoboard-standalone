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
import { describe, expect, it, vi } from 'vitest';
import { discoverHomeserverUrl } from './discoverHomeserverUrl';
import { discoverClientConfig } from './discovery';

vi.mock('./discovery', async () => ({
  ...(await vi.importActual('./discovery')),
  discoverClientConfig: vi.fn(),
}));

describe('discoverHomeserverUrl', () => {
  it('should return URL if homeserver is a valid URL', async () => {
    expect(await discoverHomeserverUrl('https://matrix.example.com')).toBe(
      'https://matrix.example.com',
    );

    expect(discoverClientConfig).not.toHaveBeenCalled();
  });

  it('should discover homeserver URL from client config when homeserver name is a domain', async () => {
    vi.mocked(discoverClientConfig).mockResolvedValue({
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: 'https://matrix.example.com/',
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    });

    expect(await discoverHomeserverUrl('example.com')).toEqual(
      'https://matrix.example.com',
    );
  });

  it('should construct and return URL when client config cannot be discovered but can make a valid URL from domain name', async () => {
    vi.mocked(discoverClientConfig).mockResolvedValue({
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
    });

    expect(await discoverHomeserverUrl('example.com')).toBe(
      'https://example.com',
    );
  });

  it('should return undefined when client config cannot be discovered and cannot make a valid URL from domain name', async () => {
    vi.mocked(discoverClientConfig).mockResolvedValue({
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
    });

    expect(await discoverHomeserverUrl('a wrong domain name')).toBeUndefined();
  });
});
