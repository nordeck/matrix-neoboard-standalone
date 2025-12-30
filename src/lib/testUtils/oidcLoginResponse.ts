/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { OidcLoginResponse } from '../../auth';

export function mockOidcLoginResponse(): OidcLoginResponse {
  return {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    homeserverUrl: 'https://matrix.example.com/',
    identityServerUrl: undefined,
    issuer: 'https://example.com',
    clientId: 'test_client_id',
    idTokenClaims: {
      aud: 'test_aud',
      exp: 100000,
      iat: 200000,
      iss: 'https://example.com',
      sub: 'test_sub',
    },
  };
}
