// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import {
  AutoDiscovery,
  discoverAndValidateOIDCIssuerWellKnown,
} from 'matrix-js-sdk';
import { ensureNoTrailingSlash } from 'matrix-js-sdk/lib/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverClientConfig, fetchAuthIssuer } from '../discovery';
import { createOidcTestClientConfig } from '../testUtils';
import { registerOidcClient, startOidcLogin } from './';
import { startLoginFlow } from './startLoginFlow';

vi.mock('matrix-js-sdk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('matrix-js-sdk')>();
  return {
    ...actual,
    discoverAndValidateOIDCIssuerWellKnown: vi.fn(),
  };
});

vi.mock('matrix-js-sdk/lib/utils', () => ({
  ensureNoTrailingSlash: vi.fn(),
}));

vi.mock('../discovery', () => ({
  discoverClientConfig: vi.fn(),
  fetchAuthIssuer: vi.fn(),
}));

vi.mock('./', () => ({
  registerOidcClient: vi.fn(),
  startOidcLogin: vi.fn(),
}));

const mockDiscoverClientConfig = vi.mocked(discoverClientConfig);
const mockFetchAuthIssuer = vi.mocked(fetchAuthIssuer);
const mockDiscoverAndValidateOIDCIssuerWellKnown = vi.mocked(
  discoverAndValidateOIDCIssuerWellKnown,
);
const mockEnsureNoTrailingSlash = vi.mocked(ensureNoTrailingSlash);
const mockRegisterOidcClient = vi.mocked(registerOidcClient);
const mockStartOidcLogin = vi.mocked(startOidcLogin);

const oidcClientConfig = createOidcTestClientConfig();

describe('startLoginFlow', () => {
  const homeserverName = 'matrix.example.com';
  const baseUrl = 'https://matrix.example.com';
  const issuer = 'https://auth.example.com';
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
    mockFetchAuthIssuer.mockResolvedValue({ issuer });
    mockDiscoverAndValidateOIDCIssuerWellKnown.mockResolvedValue(
      oidcClientConfig,
    );
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
    expect(mockFetchAuthIssuer).toHaveBeenCalledWith(baseUrl);
    expect(mockDiscoverAndValidateOIDCIssuerWellKnown).toHaveBeenCalledWith(
      issuer,
    );
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

  it('should handle auth issuer fetch failure', async () => {
    const error = new Error('Auth issuer fetch failed');
    mockFetchAuthIssuer.mockRejectedValue(error);

    await expect(startLoginFlow(homeserverName)).rejects.toThrow(
      'Auth issuer fetch failed',
    );

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).toHaveBeenCalledWith(
      'https://matrix.example.com/',
    );
    expect(mockFetchAuthIssuer).toHaveBeenCalledWith(baseUrl);
    expect(mockDiscoverAndValidateOIDCIssuerWellKnown).not.toHaveBeenCalled();
  });

  it('should handle OIDC configuration discovery failure', async () => {
    const error = new Error('OIDC configuration discovery failed');
    mockDiscoverAndValidateOIDCIssuerWellKnown.mockRejectedValue(error);

    await expect(startLoginFlow(homeserverName)).rejects.toThrow(
      'OIDC configuration discovery failed',
    );

    expect(mockDiscoverClientConfig).toHaveBeenCalledWith(homeserverName);
    expect(mockEnsureNoTrailingSlash).toHaveBeenCalledWith(
      'https://matrix.example.com/',
    );
    expect(mockFetchAuthIssuer).toHaveBeenCalledWith(baseUrl);
    expect(mockDiscoverAndValidateOIDCIssuerWellKnown).toHaveBeenCalledWith(
      issuer,
    );
    expect(mockRegisterOidcClient).not.toHaveBeenCalled();
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
    expect(mockFetchAuthIssuer).toHaveBeenCalledWith(baseUrl);
    expect(mockDiscoverAndValidateOIDCIssuerWellKnown).toHaveBeenCalledWith(
      issuer,
    );
    expect(mockRegisterOidcClient).toHaveBeenCalledWith(oidcClientConfig);
    expect(mockStartOidcLogin).not.toHaveBeenCalled();
  });
});
