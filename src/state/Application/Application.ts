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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import { getEnvironment } from '@matrix-widget-toolkit/mui';
import {
  ClientEvent,
  MatrixClient,
  MatrixError,
  SyncState,
} from 'matrix-js-sdk';
import { BehaviorSubject } from 'rxjs';
import {
  attemptCompleteLegacySsoLogin,
  attemptCompleteOidcLogin,
  createOidcTokenRefresher,
  OidcLoginResponse,
  startLoginFlow,
  TokenRefresher,
} from '../../auth';
import { isValidServerName } from '../../lib';
import { fetchWhoami } from '../../lib/matrix';
import {
  MatrixStandaloneClient,
  StandaloneApi,
  StandaloneApiImpl,
  StandaloneClient,
} from '../../toolkit/standalone';
import {
  Credentials,
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../Credentials';
import { LoggedInState, ObservableBehaviorSubject } from '../types';
import { createMatrixClient } from './createMatrixClient';

export type LifecycleState =
  // The application is starting
  | 'starting'
  // The user is logged in
  | 'loggedIn'
  // The user is not logged in
  | 'notLoggedIn'
  // The user just logged out
  | 'loggedOut';

export type ApplicationState =
  | {
      lifecycleState: 'starting' | 'loggedOut' | 'notLoggedIn';
    }
  | {
      lifecycleState: 'loggedIn';
      matrixClient: MatrixClient;
      state: LoggedInState;
    };

/**
 * This class stores the state and handles the application lifecycle on a high level.
 */
export class Application {
  private readonly resolveStandaloneApi: (standaloneApi: StandaloneApi) => void;
  public readonly standaloneApiPromise: Promise<StandaloneApi>;
  private readonly resolveWidgetApi: (widgetApi: WidgetApi) => void;
  public readonly widgetApiPromise: Promise<WidgetApi>;

  private tokenRefresher: TokenRefresher | null = null;
  private readonly state: BehaviorSubject<ApplicationState> =
    new BehaviorSubject<ApplicationState>({ lifecycleState: 'starting' });
  private readonly credentials = new Credentials();

  constructor() {
    let resolveStandaloneApi: (standaloneApi: StandaloneApi) => void = () => {};
    this.standaloneApiPromise = new Promise<StandaloneApi>((resolve) => {
      resolveStandaloneApi = resolve;
    });
    this.resolveStandaloneApi = resolveStandaloneApi;

    let resolveWidgetApi: (widgetApi: WidgetApi) => void = () => {};
    this.widgetApiPromise = new Promise<WidgetApi>((resolve) => {
      resolveWidgetApi = resolve;
    });
    this.resolveWidgetApi = resolveWidgetApi;
  }

  /**
   * Start the application:
   * Try to log in from a stored session
   * If there is no stored session, try to complete an OIDC login.
   * If all above fails the state is not logged in.
   */
  public async start(): Promise<void> {
    this.credentials.start();

    try {
      if (await this.attemptStartFromStoredSession()) {
        return;
      }
    } catch (error) {
      console.warn('Error starting from stored session', error);
    }

    const loginToken = new URL(window.location.href).searchParams.get(
      'loginToken',
    );

    if (!loginToken) {
      try {
        if (await this.attemptCompleteOidcLogin()) {
          return;
        }
      } catch (error) {
        console.warn('Error completing OIDC login', error);
      }
    } else {
      try {
        if (await this.attemptCompleteLegacySsoLogin()) {
          return;
        }
      } catch (error) {
        console.warn('Error completing Legacy SSO login', error);
      }
    }

    const staticServerName = getEnvironment('REACT_APP_HOMESERVER');
    const hasValidServerName = isValidServerName(staticServerName);
    const skipLogin = getEnvironment('REACT_APP_SKIP_LOGIN') === 'true';
    if (hasValidServerName && skipLogin) {
      await startLoginFlow(staticServerName);
    } else {
      this.state.next({ lifecycleState: 'notLoggedIn' });
    }
  }

  public getStateSubject(): ObservableBehaviorSubject<ApplicationState> {
    return this.state;
  }

  public destroy(logoutRedirectUrl?: string): void {
    const state = this.state.getValue();

    if (state.lifecycleState === 'loggedIn') {
      state.matrixClient.stopClient();
    }

    if (!logoutRedirectUrl) {
      this.state.next({ lifecycleState: 'loggedOut' });
    } else {
      window.location.href = logoutRedirectUrl;
    }
    this.state.complete();
  }

  /**
   * If OIDC and MatrixCredentials are available in localStorage
   * create and start a MatrixClient with an OIDC token refresher and
   * set the application lifecycle state to "loggedIn";
   *
   * @returns Promise that resolves to true if a session could be restored, else false.
   */
  private async attemptStartFromStoredSession(): Promise<boolean> {
    const oidcCredentials = this.credentials.getOidcCredentials();
    const matrixCredentials = this.credentials.getMatrixCredentials();

    if (matrixCredentials === null) {
      return false;
    }

    if (oidcCredentials) {
      this.tokenRefresher = await createOidcTokenRefresher(
        this.credentials,
        oidcCredentials,
        matrixCredentials.deviceId,
      );
    }

    const matrixClient = await createMatrixClient(
      matrixCredentials,
      this.tokenRefresher ?? undefined,
    );

    const standaloneClient: StandaloneClient = new MatrixStandaloneClient(
      matrixClient,
    );
    const standaloneApi: StandaloneApi = new StandaloneApiImpl(
      standaloneClient,
    );

    // Send a whoami request before starting the client
    // to ensure that we can connect to the server with valid credentials.
    try {
      await matrixClient.whoami();
    } catch (error) {
      const matrixError = error as MatrixError;
      if (matrixError.name === 'M_UNKNOWN_TOKEN') {
        // An invalid token is nothing that can be recover from.
        // Clear the persisted credentials.
        localStorage.removeItem(oidcCredentialsStorageKey);
        localStorage.removeItem(matrixCredentialsStorageKey);

        // Re-throw the error, so that the application knows that the.
        throw error;
      }
    }

    matrixClient.once(ClientEvent.Sync, (state) => {
      if (state === SyncState.Prepared) {
        this.resolveStandaloneApi(standaloneApi);
      } else {
        throw new Error('Cannot sync');
      }
    });

    await matrixClient.startClient();

    // wait for sync with the server
    await this.standaloneApiPromise;

    if (!matrixCredentials.deviceId) {
      throw new Error('Device ID is not available.');
    }

    this.state.next({
      lifecycleState: 'loggedIn',
      matrixClient,
      state: {
        userId: matrixCredentials.userId,
        deviceId: matrixCredentials.deviceId,
        homeserverUrl: matrixCredentials.homeserverUrl,
        standaloneClient,
        resolveWidgetApi: this.resolveWidgetApi,
        widgetApiPromise: this.widgetApiPromise,
      },
    });

    return true;
  }

  /**
   * If there is an OIDC login to be completed,
   * find out who we are, store the credentials and start a new session.
   *
   * @see {@link attemptCompleteOidcLogin}
   * @returns Promise that resolves to true if an OIDC login was completed, else false.
   */
  private async attemptCompleteOidcLogin(): Promise<boolean> {
    let oidcLoginResponse: OidcLoginResponse | null = null;

    try {
      oidcLoginResponse = await attemptCompleteOidcLogin();
    } catch (error) {
      console.warn('Completing OIDC login failed', error);
      return false;
    }

    if (oidcLoginResponse === null) {
      return false;
    }

    const {
      homeserverUrl,
      identityServerUrl,
      accessToken,
      refreshToken,
      clientId,
      issuer,
      idTokenClaims,
    } = oidcLoginResponse;

    let whoamiData: Awaited<ReturnType<MatrixClient['whoami']>> | null = null;

    try {
      whoamiData = await fetchWhoami(homeserverUrl, accessToken);
    } catch (error) {
      console.warn('Whoami failed', error);
      return false;
    }

    this.credentials.setOidcCredentials({
      clientId,
      issuer,
      idTokenClaims,
    });
    this.credentials.setMatrixCredentials({
      homeserverUrl,
      identityServerUrl,
      accessToken,
      refreshToken,
      userId: whoamiData.user_id,
      deviceId: whoamiData.device_id!,
    });

    return this.attemptStartFromStoredSession();
  }

  private async attemptCompleteLegacySsoLogin(): Promise<boolean> {
    const response = await attemptCompleteLegacySsoLogin();

    if (!response) {
      return false;
    }

    const {
      homeserverUrl,
      loginResponse: { access_token, refresh_token, user_id, device_id },
    } = response;

    this.credentials.setMatrixCredentials({
      homeserverUrl,
      accessToken: access_token,
      refreshToken: refresh_token, // is undefined because login request has no refresh token parameter
      userId: user_id,
      deviceId: device_id,
    });

    return await this.attemptStartFromStoredSession();
  }
}
