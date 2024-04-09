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
import { TokenRefresher } from '../../lib/oidc';
import {
  createMatrixTestCredentials,
  createOidcTestCredentials,
} from '../../lib/testUtils';
import { createAndStartMatrixClient } from './createAndStartMatrixClient';

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual('matrix-js-sdk'),
  MatrixClient: jest.fn(),
}));

const matrixTestCredentials = createMatrixTestCredentials();
const oidcTestCredentials = createOidcTestCredentials();

describe('createAndStartMatrixClient', () => {
  it('should create and start a MatrixClient', async () => {
    const tokenRefresherStub = {
      doRefreshAccessToken: () => {},
    } as unknown as TokenRefresher;
    const clientStub = {
      startClient: jest.fn(),
    } as unknown as MatrixClient;
    jest.mocked(MatrixClient).mockReturnValue(clientStub);

    await createAndStartMatrixClient(
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
      }),
    );
    expect(clientStub.startClient).toHaveBeenCalled();
  });
});
