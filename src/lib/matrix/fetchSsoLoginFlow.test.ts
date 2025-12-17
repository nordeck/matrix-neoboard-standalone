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

import { MatrixClient } from 'matrix-js-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSsoLoginFlow } from './fetchSsoLoginFlow';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  MatrixClient: vi.fn(),
}));

const homeserverUrl = 'https://matrix.example.com';

describe('fetchSsoLoginFlow', () => {
  let matrixClient: MatrixClient;

  beforeEach(() => {
    matrixClient = {
      loginFlows: vi.fn(),
    } as unknown as MatrixClient;

    vi.mocked(MatrixClient).mockReturnValue(matrixClient);
  });

  it('should fetch sso login flow', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.password',
        },
        {
          type: 'm.login.sso',
        },
        {
          type: 'm.login.token',
        },
      ],
    });

    expect(await fetchSsoLoginFlow(homeserverUrl)).toEqual({});
  });

  it('should fetch sso login flow with delegated oidc compatibility', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.password',
        },
        {
          type: 'm.login.sso',
          'org.matrix.msc3824.delegated_oidc_compatibility': true,
        },
        {
          type: 'm.login.token',
        },
      ],
    });

    expect(await fetchSsoLoginFlow(homeserverUrl)).toEqual({
      delegatedOidcCompatibility: true,
    });
  });

  it('should fetch undefined when no sso configuration', async () => {
    vi.mocked(matrixClient.loginFlows).mockResolvedValue({
      flows: [
        {
          type: 'm.login.password',
        },
        {
          type: 'm.login.token',
        },
      ],
    });

    expect(await fetchSsoLoginFlow(homeserverUrl)).toBeUndefined();
  });

  it.each(['true', 'false', {}])(
    'should fetch undefined when wrong value for delegated_oidc_compatibility: %s',
    async (value: unknown) => {
      vi.mocked(matrixClient.loginFlows).mockResolvedValue({
        flows: [
          {
            type: 'm.login.password',
          },
          {
            type: 'm.login.sso',
            'org.matrix.msc3824.delegated_oidc_compatibility': value as boolean,
          },
          {
            type: 'm.login.token',
          },
        ],
      });

      expect(await fetchSsoLoginFlow(homeserverUrl)).toBeUndefined();
    },
  );
});
