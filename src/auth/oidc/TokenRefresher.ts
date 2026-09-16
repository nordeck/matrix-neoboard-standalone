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
  AccessTokens,
  OAuth2,
  TokenRefresher as SdkTokenRefresher,
  ValidatedAuthMetadata,
} from 'matrix-js-sdk';
import { Credentials } from '../../state';
import { OidcCredentials } from './types';

/**
 * Token refresher that wraps the SDK's TokenRefresher and persists
 * new tokens to the Credentials state.
 */
export class TokenRefresher {
  private sdkRefresher: SdkTokenRefresher;

  public constructor(
    authMetadata: ValidatedAuthMetadata,
    oidcCredentials: OidcCredentials,
    deviceId: string,
    private credentials: Credentials,
  ) {
    const oauth2 = new OAuth2(authMetadata, {
      clientId: oidcCredentials.clientId,
      redirectUri: new URL(window.location.href).href,
      deviceId,
    });

    this.sdkRefresher = new SdkTokenRefresher(
      oauth2,
      async (tokens: AccessTokens) => {
        this.credentials.updateAccessTokens(tokens);
      },
    );
  }

  /**
   * The token refresh function to pass to MatrixClient.
   * Delegates to the SDK's TokenRefresher which handles the OAuth2 refresh
   * token grant and calls our onRefresh callback to persist the new tokens.
   */
  public doRefreshAccessToken = (
    refreshToken: string,
  ): Promise<AccessTokens> => {
    return this.sdkRefresher.tokenRefreshFunction(refreshToken);
  };
}
