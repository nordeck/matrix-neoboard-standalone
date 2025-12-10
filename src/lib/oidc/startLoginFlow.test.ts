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
import { ensureNoTrailingSlash } from 'matrix-js-sdk/lib/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverClientConfig, fetchAuthMetadata } from '../discovery';
import { mockOidcClientConfig } from '../testUtils';
import { registerOidcClient, startOidcLogin } from './';
import { startLoginFlow } from './startLoginFlow';

vi.mock('matrix-js-sdk/lib/utils', () => ({
  ensureNoTrailingSlash: vi.fn(),
}));

vi.mock('../discovery', () => ({
  discoverClientConfig: vi.fn(),
  fetchAuthMetadata: vi.fn(),
}));

vi.mock('./', () => ({
  registerOidcClient: vi.fn(),
  startOidcLogin: vi.fn(),
}));

const mockDiscoverClientConfig = vi.mocked(discoverClientConfig);
const mockFetchAuthMetadata = vi.mocked(fetchAuthMetadata);
const mockEnsureNoTrailingSlash = vi.mocked(ensureNoTrailingSlash);
const mockRegisterOidcClient = vi.mocked(registerOidcClient);
const mockStartOidcLogin = vi.mocked(startOidcLogin);

const oidcClientConfig = mockOidcClientConfig();

describe('startLoginFlow', () => {
  const homeserverName = 'matrix.example.com';
  const baseUrl = 'https://matrix.example.com';
  const clientId = 'test_client_id';

  beforeEach(() => {
    mockDiscoverClientConfig.mockResolvedValue({
      'm.homeserver': {
        base_url: 'https://matrix.example.com/',
        state: AutoDiscovery.SUCCESS,
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    });
    mockEnsureNoTrailingSlash.mockReturnValue(baseUrl);
    mockFetchAuthMetadata.mockResolvedValue(oidcClientConfig);
    mockRegisterOidcClient.mockResolvedValue(clientId);
    mockStartOidcLogin.mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully complete the login flow', async () => {
    await startLoginFlow(homeserverName);

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).toHaveBeenCalledWith(
      'https://matrix.example.com/',
    );
    expect(mockFetchAuthMetadata).toHaveBeenCalledWith(baseUrl);
    expect(mockRegisterOidcClient).toHaveBeenCalledWith(oidcClientConfig);
    expect(mockStartOidcLogin).toHaveBeenCalledWith(
      oidcClientConfig,
      clientId,
      baseUrl,
    );
  });

  it.each([
    { value: undefined, description: 'undefined' },
    { value: null, description: 'null' },
  ])(
    'should throw an error when base_url is $description',
    async ({ value }) => {
      mockDiscoverClientConfig.mockResolvedValue({
        'm.homeserver': {
          base_url: value,
          state: AutoDiscovery.SUCCESS,
        },
        'm.identity_server': {
          state: AutoDiscovery.PROMPT,
        },
      });

      await expect(startLoginFlow(homeserverName)).rejects.toThrow(
        'Login failed. Check your homeserver name.',
      );

      expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
      expect(mockEnsureNoTrailingSlash).not.toHaveBeenCalled();
    },
  );

  it('should handle client config discovery failure', async () => {
    const error = new Error('Client config discovery failed');
    mockDiscoverClientConfig.mockRejectedValue(error);

    await expect(startLoginFlow(homeserverName)).rejects.toThrow(
      'Client config discovery failed',
    );

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).not.toHaveBeenCalled();
  });

  it('should handle auth metadata fetch failure', async () => {
    const error = new Error('Auth metadata fetch failed');
    mockFetchAuthMetadata.mockRejectedValue(error);

    await expect(startLoginFlow(homeserverName)).rejects.toThrow(
      'Auth metadata fetch failed',
    );

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).toHaveBeenCalledWith(
      'https://matrix.example.com/',
    );
    expect(mockFetchAuthMetadata).toHaveBeenCalledWith(baseUrl);
  });

  it('should handle OIDC client registration failure', async () => {
    const error = new Error('OIDC client registration failed');
    mockRegisterOidcClient.mockRejectedValue(error);

    await expect(startLoginFlow(homeserverName)).rejects.toThrow(
      'OIDC client registration failed',
    );

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).toHaveBeenCalledWith(
      'https://matrix.example.com/',
    );
    expect(mockFetchAuthMetadata).toHaveBeenCalledWith(baseUrl);
    expect(mockRegisterOidcClient).toHaveBeenCalledWith(oidcClientConfig);
    expect(mockStartOidcLogin).not.toHaveBeenCalled();
  });
});
