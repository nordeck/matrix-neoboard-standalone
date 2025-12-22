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
import { AutoDiscovery, MatrixClient } from 'matrix-js-sdk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverClientConfig } from './discovery';
import { startLegacySsoLoginFlow } from './legacy';
import { startOidcLoginFlow } from './oidc';
import { startLoginFlow } from './startLoginFlow';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  MatrixClient: vi.fn(),
}));

vi.mock('./discovery', async () => ({
  ...(await vi.importActual('./discovery')),
  discoverClientConfig: vi.fn(),
}));

vi.mock('./oidc');
vi.mock('./legacy');

describe('startLoginFlow', () => {
  let matrixClient: MatrixClient;

  beforeEach(() => {
    matrixClient = {
      loginFlows: vi.fn(),
    } as unknown as MatrixClient;

    vi.mocked(MatrixClient).mockReturnValue(matrixClient);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should start oidc login flow from homeserver URL', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
          'org.matrix.msc3824.delegated_oidc_compatibility': true,
        },
      ],
    });

    await startLoginFlow('https://matrix.example.com');

    expect(startOidcLoginFlow).toHaveBeenCalledWith(
      'https://matrix.example.com',
    );
  });

  it('should start oidc login flow from homeserver name', async () => {
    vi.mocked(discoverClientConfig).mockResolvedValue({
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: 'https://matrix.example.com/',
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    });

    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
          'org.matrix.msc3824.delegated_oidc_compatibility': true,
        },
      ],
    });

    await startLoginFlow('example.com');

    expect(startOidcLoginFlow).toHaveBeenCalledWith(
      'https://matrix.example.com',
    );
  });

  it('should start oidc login flow from homeserver name when client config cannot be discovered', async () => {
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

    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
          'org.matrix.msc3824.delegated_oidc_compatibility': true,
        },
      ],
    });

    await startLoginFlow('example.com');

    expect(startOidcLoginFlow).toHaveBeenCalledWith('https://example.com');
  });

  it('should start legacy sso login flow from homeserver URL', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
        },
      ],
    });

    await startLoginFlow('https://matrix.example.com');

    expect(startLegacySsoLoginFlow).toHaveBeenCalledWith(
      'https://matrix.example.com',
    );
  });

  it('should start legacy sso login flow from homeserver name', async () => {
    vi.mocked(discoverClientConfig).mockResolvedValue({
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: 'https://matrix.example.com/',
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    });

    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
        },
      ],
    });

    await startLoginFlow('example.com');

    expect(startLegacySsoLoginFlow).toHaveBeenCalledWith(
      'https://matrix.example.com',
    );
  });

  it('should start legacy login flow from homeserver name when client config cannot be discovered', async () => {
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

    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.sso',
        },
      ],
    });

    await startLoginFlow('example.com');

    expect(startLegacySsoLoginFlow).toHaveBeenCalledWith('https://example.com');
  });

  it('should fail if no sso authentication type', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.password',
        },
      ],
    });

    await expect(startLoginFlow('https://matrix.example.com')).rejects.toThrow(
      'Homeserver "m.login.sso" authentication type is not configured',
    );
  });

  it('should fail for a wrong homeserver name', async () => {
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

    await expect(startLoginFlow('a wrong name')).rejects.toThrow(
      'Could not get homeserver base URL',
    );
  });
});
