/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
