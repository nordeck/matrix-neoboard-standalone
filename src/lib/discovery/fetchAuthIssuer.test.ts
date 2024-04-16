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
import Joi from 'joi';
import { fetchAuthIssuer } from './fetchAuthIssuer';

describe('fetchAuthIssuer', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should fetch and return an auth issuer from the API', async () => {
    const issuerData = {
      issuer: 'https://id.example.com',
    };

    fetchMock.get(
      'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer',
      issuerData,
    );

    expect(await fetchAuthIssuer('https://example.com')).toEqual(issuerData);
  });

  it('should re-throw request errors', async () => {
    fetchMock.get(
      'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer',
      { throws: new Error('request error') },
    );

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('auth_issuer request failed', {
        cause: new Error('request error'),
      }),
    );
  });

  it('should throw response errors', async () => {
    fetchMock.get(
      'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer',
      { status: 500, body: 'server error' },
    );

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('auth_issuer response not okay', {
        cause: new Error('Server returned 500 error: server error'),
      }),
    );
  });

  it('should re-throw JSON parsing errors', async () => {
    fetchMock.get(
      'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer',
      '{',
    );

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      'failed to parse auth_issuer response',
    );
  });

  it('should throw an error if the response is invalid', async () => {
    fetchMock.get(
      'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer',
      '{}',
    );

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('invalid auth_issuer response', {
        cause: new Joi.ValidationError('"issuer" is required', [], {}),
      }),
    );
  });
});
