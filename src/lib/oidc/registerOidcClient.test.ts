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

import fetchMock from 'fetch-mock-jest';
import { createOidcTestClientConfig } from '../testUtils';
import { registerOidcClient } from './registerOidcClient';

const oidcClientConfig = createOidcTestClientConfig();

describe('registerOidcClient', () => {
  beforeEach(() => {
    fetchMock.get(
      'https://example.com/.well-known/openid-configuration',
      oidcClientConfig.metadata,
    );
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should register an OIDC client', async () => {
    fetchMock.post(
      {
        method: 'POST',
        url: 'https://auth.exmple.com/register',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          client_name: 'NeoBoard',
          client_uri: 'http://example.com/',
          response_types: ['code'],
          grant_types: ['authorization_code', 'refresh_token'],
          redirect_uris: ['http://example.com/'],
          id_token_signed_response_alg: 'RS256',
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          contacts: ['noreply@example.com'],
          policy_uri: 'http://example.com/',
          tos_uri: 'http://example.com/',
        },
      },
      {
        body: {
          client_id: 'test_client_id',
        },
      },
    );

    expect(await registerOidcClient(oidcClientConfig)).toBe('test_client_id');
  });
});
