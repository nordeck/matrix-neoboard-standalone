// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { fetchWhoami } from './fetchWhoami';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

describe('fetchWhoami', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should issue a who-am-I-request with a temporary MatrixClient', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url ===
          'https://matrix.example.com/_matrix/client/v3/account/whoami' &&
        req.headers.get('Authorization') === 'Bearer test_access_token'
      ) {
        return JSON.stringify({
          user_id: 'test_user_id',
          device_id: 'test_device_id',
        });
      }
      return '';
    });

    expect(
      await fetchWhoami('https://matrix.example.com', 'test_access_token'),
    ).toEqual({
      user_id: 'test_user_id',
      device_id: 'test_device_id',
    });
  });
});
