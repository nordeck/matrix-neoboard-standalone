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
