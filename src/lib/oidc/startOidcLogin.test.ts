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
import { createOidcTestClientConfig } from '../testUtils';
import { startOidcLogin } from './startOidcLogin';

const oidcClientConfig = createOidcTestClientConfig();

describe('startOidcLogin', () => {
  beforeAll(() => {
    fetchMock.get(
      'https://example.com/.well-known/openid-configuration',
      oidcClientConfig.metadata,
    );
  });

  afterAll(() => {
    fetchMock.mockReset();
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
