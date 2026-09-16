/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import {
  ClientEvent,
  ClientEventHandlerMap,
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
  mockMatrixCredentials,
  mockOidcCredentials,
  mockOpenIdConfiguration,
} from '../../lib/testUtils';
import {
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../Credentials';
import { Application } from './Application';

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import type { FetchMock } from 'vitest-fetch-mock';
import { legacySsoHomeserverUrlStorageKey, startLoginFlow } from '../../auth';
const fetch = global.fetch as FetchMock;

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  // Mock MatrixClient to prevent mocking of a lot of Matrix requests
  MatrixClient: vi.fn(),
}));

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

vi.mock('../../auth', async () => ({
  ...(await vi.importActual('../../auth')),
  startLoginFlow: vi.fn(),
}));

const openIdConfiguration = mockOpenIdConfiguration();
const oidcCredentials = mockOidcCredentials();
const matrixCredentials = mockMatrixCredentials();

describe('Application', () => {
  let application: Application;
  let clientMock: MatrixClient;
  let consoleWarningSpy: MockInstance;

  beforeEach(() => {
    consoleWarningSpy = vi.spyOn(console, 'warn');

    // Mock common OAuth2 requests
    fetch.mockResponse((req) => {
      if (req.url === 'https://matrix.example.com/_matrix/client/versions') {
        return JSON.stringify({
          versions: ['v1.1', 'v1.15'],
        });
      }

      if (
        req.url === 'https://matrix.example.com/_matrix/client/v1/auth_metadata'
      ) {
        return JSON.stringify(openIdConfiguration);
      }

      if (req.url === openIdConfiguration.token_endpoint) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: matrixCredentials.accessToken,
            refresh_token: matrixCredentials.refreshToken,
            token_type: 'Bearer',
          }),
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
      getAuthMetadata: vi.fn().mockResolvedValue(openIdConfiguration),
    } as unknown as MatrixClient;
    vi.mocked(MatrixClient).mockReturnValue(clientMock);
    vi.mocked(MatrixClient).mockClear();

    vi.mocked(getEnvironment).mockImplementation(
      (_, defaultValue) => defaultValue,
    );

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
    expect(state.lifecycleState).toBe('notLoggedIn');
  });

  it('should start login flow when homeserver and skip login environment variables are set', async () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return 'https://matrix.example.com';
        case 'REACT_APP_SKIP_LOGIN':
          return 'true';
        default:
          return defaultValue;
      }
    });

    await application.start();

    expect(startLoginFlow).toHaveBeenCalledWith('https://matrix.example.com');
  });

  it('should resume sessions from localStorage for OIDC', async () => {
    // Set up credentials in localStorage, so that it is tried to resume a session from there
    localStorage.setItem(
      oidcCredentialsStorageKey,
      JSON.stringify(oidcCredentials),
    );
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixCredentials),
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

  it('should resume sessions from localStorage for legacy SSO', async () => {
    // Set up credentials in localStorage, so that it is tried to resume a session from there
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixCredentials),
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
      JSON.stringify(oidcCredentials),
    );
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixCredentials),
    );
    const matrixClientError = new Error('test_error');
    vi.mocked(clientMock.startClient).mockRejectedValue(matrixClientError);

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('notLoggedIn');

    expect(console.warn).toHaveBeenCalledWith(
      'Error starting from stored session',
      matrixClientError,
    );
  });

  it('should complete an OIDC login', async () => {
    // Set code and state URL params so that completing an OIDC login is tried
    window.location.href =
      'https://example.com/#code=test_code&state=test_state';

    // Store OAuth context as startOidcLogin does
    sessionStorage.setItem(
      'neoboard_oauth_context',
      JSON.stringify({
        homeserverUrl: matrixCredentials.homeserverUrl,
        issuer: oidcCredentials.issuer,
        clientId: oidcCredentials.clientId,
        redirectUri: 'https://example.com/',
        codeVerifier: 'test_code_verifier',
        deviceId: matrixCredentials.deviceId,
        state: 'test_state',
      }),
    );

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
    expect(vi.mocked(MatrixClient)).toHaveBeenLastCalledWith(
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
      'https://example.com/#code=test_code&state=test_state';

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('notLoggedIn');

    expect(console.warn).toHaveBeenCalledWith(
      'Completing OIDC login failed',
      new Error('Missing stored OAuth context.'),
    );
  });

  it('should complete a legacy SSO login', async () => {
    // Set credentials to local storage
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(matrixCredentials),
    );

    // Set homeserver url to local storage
    localStorage.setItem(
      legacySsoHomeserverUrlStorageKey,
      'https://matrix.example.com',
    );

    // Set the login token after SSO login
    window.location.href =
      'https://example.com/?loginToken=syl_QAumUnCcrABBHhTciIwf_3TWbEs';

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
  });

  it('should not explode when completing legacy SSO login with missing login token', async () => {
    // Don't provide a login token
    window.location.href = 'https://example.com/';

    await application.start();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('notLoggedIn');
  });

  it('should change state to "loggedOut" on destroy', async () => {
    application.destroy();

    const state = application.getStateSubject().getValue();
    expect(state.lifecycleState).toBe('loggedOut');
  });

  it('should redirect on destroy when logout URL is provided', async () => {
    application.destroy('https://id.example.com/logout');

    expect(window.location.href).toBe('https://id.example.com/logout');
  });
});
