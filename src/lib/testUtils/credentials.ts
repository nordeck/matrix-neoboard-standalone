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

import { MatrixCredentials } from '../../state';
import { OidcCredentials } from '../oidc';

export function createOidcTestCredentials(): OidcCredentials {
  return {
    issuer: 'https://example.com',
    clientId: 'test_client_id',
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    homeserverUrl: 'https://matrix.example.com/',
    identityServerUrl: undefined,
    idTokenClaims: {
      aud: 'test_aud',
      exp: 100000,
      iat: 200000,
      iss: 'https://example.com',
      sub: 'test_sub',
    },
  };
}

export function createMatrixTestCredentials(): MatrixCredentials {
  return {
    userId: '@test:example.com',
    deviceId: 'test_device_id',
  };
}
