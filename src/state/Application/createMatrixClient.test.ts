// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import { MatrixClient } from 'matrix-js-sdk';
import { describe, expect, it, vi } from 'vitest';
import { TokenRefresher } from '../../lib/oidc';
import {
  createMatrixTestCredentials,
  createOidcTestCredentials,
} from '../../lib/testUtils';
import { createMatrixClient } from './createMatrixClient';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  MatrixClient: vi.fn(),
}));

const matrixTestCredentials = createMatrixTestCredentials();
const oidcTestCredentials = createOidcTestCredentials();

describe('createMatrixClient', () => {
  it('should create a MatrixClient', async () => {
    const tokenRefresherStub = {
      doRefreshAccessToken: () => {},
    } as unknown as TokenRefresher;
    const clientStub = {
      startClient: vi.fn(),
    } as unknown as MatrixClient;
    vi.mocked(MatrixClient).mockReturnValue(clientStub);

    await createMatrixClient(
      oidcTestCredentials,
      matrixTestCredentials,
      tokenRefresherStub,
    );

    expect(MatrixClient).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: 'https://matrix.example.com/',
        accessToken: 'test_access_token',
        fetchFn: expect.any(Function),
        userId: '@test:example.com',
        deviceId: 'test_device_id',
        refreshToken: 'test_refresh_token',
        tokenRefreshFunction: expect.any(Function),
        store: expect.anything(),
        scheduler: expect.anything(),
      }),
    );
  });
});
