/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import type { FetchMock } from 'vitest-fetch-mock';
import { mockOpenIdConfiguration } from '../testUtils';
import { fetchAuthMetadata } from './fetchAuthMetadata';
const fetch = global.fetch as FetchMock;

const authMetadata = mockOpenIdConfiguration();

describe('fetchAuthMetadata', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should fetch and return authentication metadata', async () => {
    fetch.mockResponse((req) => {
      if (req.url === 'https://matrix.example.com/_matrix/client/versions') {
        return JSON.stringify({
          versions: ['v1.1', 'v1.15'],
          unstable_features: {},
        });
      }

      if (
        req.url === 'https://matrix.example.com/_matrix/client/v1/auth_metadata'
      ) {
        return JSON.stringify(authMetadata);
      }

      return '';
    });

    expect(await fetchAuthMetadata('https://matrix.example.com')).toEqual(
      authMetadata,
    );
  });
});
