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
import { Credentials } from '../../state';
import {
  createMatrixTestCredentials,
  createOidcTestClientConfig,
  createOidcTestCredentials,
} from '../testUtils';
import { TokenRefresher } from './TokenRefresher';
import { createOidcTokenRefresher } from './createOidcTokenRefresher';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

describe('createOidcTokenRefresher', () => {
  const oidcClientConfig = createOidcTestClientConfig();
  const oidcCredentials = createOidcTestCredentials();
  const matrixCredentials = createMatrixTestCredentials();
  const credentials = new Credentials();
  credentials.setMatrixCredentials(matrixCredentials);
  credentials.setOidcCredentials(oidcCredentials);

  beforeEach(() => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://example.com/.well-known/openid-configuration') {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(oidcClientConfig.metadata),
        };
      } else if (req.url === oidcClientConfig.metadata.jwks_uri!) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keys: [] }),
        };
      }
      return '';
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should create a TokenRefresher', async () => {
    expect(
      await createOidcTokenRefresher(
        credentials,
        oidcCredentials,
        matrixCredentials.deviceId,
      ),
    ).toBeInstanceOf(TokenRefresher);
  });
});
