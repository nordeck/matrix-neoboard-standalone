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

import { AccessTokens, OidcTokenRefresher } from 'matrix-js-sdk';
import { Credentials } from '../../state';
import { OidcCredentials } from './types';

/**
 * OidcTokenRefresher implementation that gets a Credentials instance and
 * updates the access tokens on token refresh.
 */
export class TokenRefresher extends OidcTokenRefresher {
  public constructor(
    oidcCredentials: OidcCredentials,
    deviceId: string,
    private credentials: Credentials,
  ) {
    super(
      oidcCredentials.issuer,
      oidcCredentials.clientId,
      new URL(window.location.href).href,
      deviceId,
      oidcCredentials.idTokenClaims,
    );
  }

  /**
   * Update the access token on the Credentials state.
   *
   * @param accessToken - new access token
   * @param refreshToken - OPTIONAL new refresh token
   * @returns Promise<void>
   */
  public async persistTokens(accessTokens: AccessTokens): Promise<void> {
    this.credentials.updateAccessTokens(accessTokens);
  }
}
