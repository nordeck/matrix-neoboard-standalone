/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MatrixCredentials } from '../../auth';
import { registerGuest } from './registerGuest';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

const homeserverUrl = 'https://matrix.example.com';
const registerGuestUrl = `${homeserverUrl}/_synapse/client/register_guest`;

const matrixCredentials: MatrixCredentials = {
  accessToken: 'access_token',
  homeserverUrl,
  userId: '@guest-abc:example.com',
  deviceId: 'device_id',
};

describe('registerGuest', () => {
  beforeEach(() => {
    fetch.resetMocks();

    fetch.mockResponse((req) => {
      if (req.url === registerGuestUrl) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matrixCredentials),
        };
      }

      return '';
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should register a guest and return the credentials', async () => {
    await expect(registerGuest(homeserverUrl, 'Alice')).resolves.toEqual(
      matrixCredentials,
    );
  });
});
