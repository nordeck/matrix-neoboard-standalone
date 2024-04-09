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
import { BehaviorSubject } from 'rxjs';
import { Credentials, ObservableBehaviorSubject } from '..';
import { fetchWhoami } from '../../lib/matrix';
import {
  OidcCredentials,
  TokenRefresher,
  createOidcTokenRefresher,
  maybeCompleteOidcLogin,
} from '../../lib/oidc';
import { createAndStartMatrixClient } from './createAndStartMatrixClient';

export type LifecycleState =
  // The application is starting
  | 'starting'
  // The user is logged in
  | 'loggedIn'
  // The user is not logged in
  | 'loggedOut';

export type ApplicationState =
  | {
      lifecycleState: 'starting' | 'loggedOut';
    }
  | {
      lifecycleState: 'loggedIn';
      matrixClient: MatrixClient;
    };

/**
 * This class stores the state and handles the application lifecycle on a high level.
 */
export class Application {
  private tokenRefresher: TokenRefresher | null = null;
  private readonly state: BehaviorSubject<ApplicationState> =
    new BehaviorSubject<ApplicationState>({ lifecycleState: 'starting' });
  public readonly credentials = new Credentials();

  /**
   * Start the application:
   * Try to log in from a stored session
   * If there is no stored session, try to complete an OIDC login.
   * If all above fails the state is logged out.
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

    this.state.next({ lifecycleState: 'loggedOut' });
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

    const matrixClient = await createAndStartMatrixClient(
      {
        ...oidcCredentials,
        accessToken: oidcCredentials.accessToken,
      },
      matrixCredentials,
      this.tokenRefresher ?? undefined,
    );

    this.state.next({
      lifecycleState: 'loggedIn',
      matrixClient,
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
