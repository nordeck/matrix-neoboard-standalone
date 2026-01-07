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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockOidcClientConfig } from '../../lib/testUtils';
import { registerOidcClient } from './registerOidcClient';
import { startOidcLogin } from './startOidcLogin';
import { startOidcLoginFlow } from './startOidcLoginFlow';

vi.mock('./registerOidcClient', () => ({
  registerOidcClient: vi.fn(),
}));
vi.mock('./startOidcLogin', () => ({
  startOidcLogin: vi.fn(),
}));

describe('startOidcLoginFlow', () => {
  const homeserverUrl = 'https://matrix.example.com';
  const clientId = 'test_client_id';
  const oidcClientConfig = mockOidcClientConfig();

  beforeEach(() => {
    vi.mocked(registerOidcClient).mockResolvedValue(clientId);
    vi.mocked(startOidcLogin).mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start the login flow', async () => {
    await startOidcLoginFlow(homeserverUrl, oidcClientConfig);

    expect(registerOidcClient).toHaveBeenCalledWith(oidcClientConfig);
    expect(startOidcLogin).toHaveBeenCalledWith(
      oidcClientConfig,
      clientId,
      homeserverUrl,
    );
  });

  it('should handle OIDC client registration failure', async () => {
    const error = new Error('OIDC client registration failed');
    vi.mocked(registerOidcClient).mockRejectedValue(error);

    await expect(
      startOidcLoginFlow(homeserverUrl, oidcClientConfig),
    ).rejects.toThrow('OIDC client registration failed');

    expect(registerOidcClient).toHaveBeenCalledWith(oidcClientConfig);
    expect(startOidcLogin).not.toHaveBeenCalled();
  });
});
