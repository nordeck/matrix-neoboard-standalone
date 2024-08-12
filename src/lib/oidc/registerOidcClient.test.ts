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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createOidcTestClientConfig } from '../testUtils';
import { registerOidcClient } from './registerOidcClient';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const oidcClientConfig = createOidcTestClientConfig();

describe('registerOidcClient', () => {
  beforeEach(() => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return JSON.stringify(oidcClientConfig.metadata);
      }
      return '';
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should register an OIDC client', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url === 'https://auth.exmple.com/register' &&
        req.method === 'POST' &&
        req.headers.get('Content-Type') === 'application/json'
      ) {
        const expectedBody = {
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
        };
        // Arrays in the parsed body are behaving weirdly, so we need to compare the stringified body
        if (req.body?.toString() === JSON.stringify(expectedBody)) {
          return {
            body: JSON.stringify({
              client_id: 'test_client_id',
            }),
          };
        }
      }
      return '';
    });

    expect(await registerOidcClient(oidcClientConfig)).toBe('test_client_id');
  });
});
