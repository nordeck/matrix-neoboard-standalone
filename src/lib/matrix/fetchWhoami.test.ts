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

import fetchMock from 'fetch-mock-jest';
import { fetchWhoami } from './fetchWhoami';

describe('fetchWhoami', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should issue a who-am-I-request with a temporary MatrixClient', async () => {
    fetchMock.get(
      {
        url: 'https://matrix.example.com/_matrix/client/v3/account/whoami',
        headers: {
          Authorization: 'Bearer test_access_token',
        },
      },
      {
        user_id: 'test_user_id',
        device_id: 'test_device_id',
      },
    );

    expect(
      await fetchWhoami('https://matrix.example.com', 'test_access_token'),
    ).toEqual({
      user_id: 'test_user_id',
      device_id: 'test_device_id',
    });
  });
});
