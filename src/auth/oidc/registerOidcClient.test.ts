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

import { afterEach, describe, expect, it } from 'vitest';
import { mockOpenIdConfiguration } from '../../lib/testUtils';
import { registerOidcClient } from './registerOidcClient';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const authMetadata = mockOpenIdConfiguration();

describe('registerOidcClient', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should register an OAuth2 client', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url === authMetadata.registration_endpoint &&
        req.method === 'POST' &&
        req.headers.get('Content-Type') === 'application/json'
      ) {
        const body = JSON.parse(req.body?.toString() ?? '{}');
        if (
          body.client_name === 'NeoBoard' &&
          body.application_type === 'web' &&
          body.token_endpoint_auth_method === 'none'
        ) {
          return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: 'test_client_id',
            }),
          };
        }
      }
      return '';
    });

    expect(await registerOidcClient(authMetadata)).toBe('test_client_id');
  });
});
