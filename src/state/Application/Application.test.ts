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

import {
  ClientEvent,
  ClientEventHandlerMap,
  completeAuthorizationCodeGrant,
  MatrixClient,
  SyncState,
} from 'matrix-js-sdk';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from 'vitest';
import {
  createMatrixTestCredentials,
  createOidcTestClientConfig,
  createOidcTestCredentials,
} from '../../lib/testUtils';
import {
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../Credentials';
import { Application } from './Application';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  // Mock MatrixClient to prevent mocking of a lot of Matrix requests
  MatrixClient: vi.fn(),
  // Mock completeAuthorizationCodeGrant to prevent mocking of a lot of OIDC stuff
  completeAuthorizationCodeGrant: vi.fn(),
}));

const oidcClientConfig = createOidcTestClientConfig();
const oidcTestCredentials = createOidcTestCredentials();
const matrixTestCredentials = createMatrixTestCredentials();

describe('Application', () => {
  let application: Application;
  let clientMock: MatrixClient;
  let consoleWarningSpy: MockInstance;

  beforeEach(() => {
    consoleWarningSpy = vi.spyOn(console, 'warn');

    // Mock common OIDC requests
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(oidcClientConfig.metadata),
        };
      } else if (req.url === oidcClientConfig.metadata.jwks_uri!) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keys: [] }),
        };
      }
      return '';
    });

    // Stub a MatrixClient with the minimum functions mocked,
    // that are required for the tests here
    clientMock = {
      startClient: vi.fn(),
      stopClient: vi.fn(),
      whoami: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      once: vi.fn(),
    } as unknown as MatrixClient;
    vi.mocked(MatrixClient).mockReturnValue(clientMock);

    application = new Application();
  });

  afterEach(() => {
    consoleWarningSpy.mockRestore();
    application.destroy();
    fetch.resetMocks();
    localStorage.clear();
  });

  it('should be logged out if there is no stored session nor a OIDC login to complete', async () => {
    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedOut');
  });

  it('should resume sessions from localStorage', async () => {
    // Set up credentials in localStorage, so that it is tried to resume a session from there
    localStorage.setItem(
      oidcCredentialsStorageKey,
      JSON.stringify(oidcTestCredentials),
    );
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixTestCredentials),
    );

    // Mock sync prepared
    vi.mocked(clientMock).once.mockImplementationOnce((event, listener) => {
      if (event === ClientEvent.Sync) {
        (listener as ClientEventHandlerMap[ClientEvent.Sync])(
          SyncState.Prepared,
          null,
        );
      }
      return clientMock;
    });

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedIn');

    // Make TypeScript happy
    if (state.lifecycleState !== 'loggedIn') return;

    // Ensure that the MatrixClient has been created with the stored credentials
    expect(vi.mocked(MatrixClient)).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: 'test_access_token',
        baseUrl: 'https://matrix.example.com/',
        deviceId: 'test_device_id',
        fetchFn: expect.any(Function),
        refreshToken: 'test_refresh_token',
        tokenRefreshFunction: expect.any(Function),
        userId: '@test:example.com',
      }),
    );
    expect(clientMock.startClient).toHaveBeenCalled();
  });

  it('should log and not explode when resuming a session errors', async () => {
    // Mute console.warn for this test
    vi.mocked(console.warn).mockImplementation(() => {});

    // Set up credentials in localStorage, so that it is tried to resume a session from there
    localStorage.setItem(
      oidcCredentialsStorageKey,
      JSON.stringify(oidcTestCredentials),
    );
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixTestCredentials),
    );
    const matrixClientError = new Error('test_error');
    vi.mocked(clientMock.startClient).mockRejectedValue(matrixClientError);

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedOut');

    expect(console.warn).toHaveBeenCalledWith(
      'Error starting from stored session',
      matrixClientError,
    );
  });

  it('should complete an OIDC login', async () => {
    // Set code and state URL params so that completing an OIDC login is tried
    window.location.href =
      'https://example.com/?code=test_code&state=test_state';

    // Mock OIDC related function to prevent mocking a lot of OIDC stuff
    vi.mocked(completeAuthorizationCodeGrant).mockResolvedValue({
      homeserverUrl: oidcTestCredentials.homeserverUrl,
      idTokenClaims: oidcTestCredentials.idTokenClaims,
      oidcClientSettings: {
        issuer: oidcTestCredentials.issuer,
        clientId: oidcTestCredentials.clientId,
      },
      tokenResponse: {
        access_token: oidcTestCredentials.accessToken,
        refresh_token: oidcTestCredentials.refreshToken,
        token_type: 'Bearer',
        scope: 'oidc',
      },
    });

    // Mock the whoami response
    vi.mocked(clientMock.whoami).mockResolvedValue({
      user_id: '@test:example.com',
      device_id: 'test_device_id',
    });

    // Mock sync prepared
    vi.mocked(clientMock).once.mockImplementationOnce((event, listener) => {
      if (event === ClientEvent.Sync) {
        (listener as ClientEventHandlerMap[ClientEvent.Sync])(
          SyncState.Prepared,
          null,
        );
      }
      return clientMock;
    });

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedIn');

    // Make TypeScript happy
    if (state.lifecycleState !== 'loggedIn') return;

    // Ensure that the MatrixClient has been created with the credentials delivered by OIDC
    expect(vi.mocked(MatrixClient)).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        accessToken: 'test_access_token',
        baseUrl: 'https://matrix.example.com/',
        deviceId: 'test_device_id',
        fetchFn: expect.any(Function),
        refreshToken: 'test_refresh_token',
        tokenRefreshFunction: expect.any(Function),
        userId: '@test:example.com',
      }),
    );
    expect(clientMock.startClient).toHaveBeenCalled();
  });

  it('should log and not explode when completing an OIDC login errors', async () => {
    // Mute console.warn for this test
    vi.mocked(console.warn).mockImplementation(() => {});

    // Only provide code and state params; it should then explode somewhere during the OIDC process
    window.location.href =
      'https://example.com/?code=test_code&state=test_state';

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedOut');

    expect(console.warn).toHaveBeenCalledWith(
      'Error completing OIDC login',
      new TypeError("Cannot read properties of undefined (reading 'user_id')"),
    );
  });
});
