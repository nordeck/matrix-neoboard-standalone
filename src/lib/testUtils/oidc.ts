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
