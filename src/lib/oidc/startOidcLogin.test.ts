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

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createOidcTestClientConfig } from '../testUtils';
import { startOidcLogin } from './startOidcLogin';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const oidcClientConfig = createOidcTestClientConfig();

describe('startOidcLogin', () => {
  beforeAll(() => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(oidcClientConfig.metadata),
        };
      }
      return '';
    });
  });

  afterAll(() => {
    fetch.resetMocks();
  });

  it('should redirect to the authorisation URL', async () => {
    await startOidcLogin(
      oidcClientConfig,
      'test_client_id',
      'https://matrix.example.com',
    );

    expect(window.location.href).toMatch(
      /^https:\/\/auth\.example\.com\/auth\?client_id=test_client_id&redirect_uri=http%3A%2F%2Fexample\.com%2F&response_type=code&scope=openid\+urn%3Amatrix%3Aorg\.matrix\.msc2967\.client%3Aapi%3A\*\+urn%3Amatrix%3Aorg\.matrix\.msc2967\.client%3Adevice%3A.+&nonce=.+&state=.+&code_challenge=.+&code_challenge_method=S256&response_mode=query/,
    );
  });
});
