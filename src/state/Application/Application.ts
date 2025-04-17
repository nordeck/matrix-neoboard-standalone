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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import {
  ClientEvent,
  MatrixClient,
  MatrixError,
  SyncState,
} from 'matrix-js-sdk';
import { BehaviorSubject } from 'rxjs';
import { Credentials, LoggedInState, ObservableBehaviorSubject } from '..';
import { fetchWhoami } from '../../lib/matrix';
import {
  OidcCredentials,
  TokenRefresher,
  createOidcTokenRefresher,
  maybeCompleteOidcLogin,
} from '../../lib/oidc';
import {
  MatrixStandaloneClient,
  StandaloneApi,
  StandaloneApiImpl,
  StandaloneClient,
} from '../../toolkit/standalone';
import {
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../Credentials';
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
      if (await this.maybeStartFromStoredSession()) {
        return;
      }
    } catch (error) {
      console.warn('Error starting from stored session', error);
    }

    try {
      if (await this.maybeCompleteOidcLogin()) {
        return;
      }
    } catch (error) {
      console.warn('Error completing OIDC login', error);
    }

    this.state.next({ lifecycleState: 'notLoggedIn' });
  }

  public getStateSubject(): ObservableBehaviorSubject<ApplicationState> {
    return this.state;
  }

  public destroy(): void {
    const state = this.state.getValue();

    if (state.lifecycleState === 'loggedIn') {
      state.matrixClient.stopClient();
    }

    this.state.next({ lifecycleState: 'loggedOut' });
    this.state.complete();
  }

  /**
   * If OIDC and MatrixCredentials are available in localStorage
   * create and start a MatrixClient with an OIDC token refresher and
   * set the application lifecycle state to "loggedIn";
   *
   * @returns Promise that resolves to true if a session could be restored, else false.
   */
  private async maybeStartFromStoredSession(): Promise<boolean> {
    const oidcCredentials = this.credentials.getOidcCredentials();
    const matrixCredentials = this.credentials.getMatrixCredentials();

    if (oidcCredentials === null || matrixCredentials === null) {
      return false;
    }

    this.tokenRefresher = await createOidcTokenRefresher(
      this.credentials,
      oidcCredentials,
      matrixCredentials.deviceId,
    );

    const matrixClient = await createMatrixClient(
      {
        ...oidcCredentials,
        accessToken: oidcCredentials.accessToken,
      },
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
        homeserverUrl: oidcCredentials.homeserverUrl,
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
   * @see {@link maybeCompleteOidcLogin}
   * @returns Promise that resolves to true if an OIDC login was completed, else false.
   */
  private async maybeCompleteOidcLogin(): Promise<boolean> {
    let oidcCredentials: OidcCredentials | null = null;

    try {
      oidcCredentials = await maybeCompleteOidcLogin();
    } catch (error) {
      console.warn('Completing OIDC login failed', error);
      return false;
    }

    if (oidcCredentials === null) {
      return false;
    }

    let whoamiData: Awaited<ReturnType<MatrixClient['whoami']>> | null = null;

    try {
      whoamiData = await fetchWhoami(
        oidcCredentials.homeserverUrl,
        oidcCredentials.accessToken,
      );
    } catch (error) {
      console.warn('Whoami failed', error);
      return false;
    }

    this.credentials.setOidcCredentials(oidcCredentials);
    this.credentials.setMatrixCredentials({
      userId: whoamiData!.user_id,
      deviceId: whoamiData!.device_id!,
    });

    return this.maybeStartFromStoredSession();
  }
}
