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
