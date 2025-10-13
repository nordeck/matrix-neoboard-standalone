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
