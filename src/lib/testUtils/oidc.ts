// SPDX-License-Identifier: AGPL-3.0-or-later

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

import { OidcClientConfig } from 'matrix-js-sdk';

export function createOidcTestClientConfig(): OidcClientConfig {
  return {
    authorizationEndpoint: 'https://auth.example.com/auth',
    tokenEndpoint: 'https://auth.example.com/token',
    registrationEndpoint: 'https://auth.exmple.com/register',
    metadata: {
      authorization_endpoint: 'https://auth.example.com/auth',
      code_challenge_methods_supported: ['S256'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      issuer: 'https://example.com',
      registration_endpoint: 'https://auth.example.com/register',
      response_types_supported: ['code'],
      revocation_endpoint: 'https://auth.example.com/revoke',
      token_endpoint: 'https://auth.example.com/token',
      jwks_uri: 'https://auth.example.com/jwks',
      device_authorization_endpoint: 'https://auth.example.com/device',
    },
  };
}
