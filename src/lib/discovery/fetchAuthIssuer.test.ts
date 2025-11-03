// SPDX-License-Identifier: AGPL-3.0-or-later

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

import Joi from 'joi';
import { afterEach, describe, expect, it } from 'vitest';
import { fetchAuthIssuer } from './fetchAuthIssuer';

import type { FetchMock } from 'vitest-fetch-mock';
const fetch = global.fetch as FetchMock;

describe('fetchAuthIssuer', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should fetch and return an auth issuer from the API', async () => {
    const issuerData = {
      issuer: 'https://id.example.com',
    };

    fetch.mockResponse((req) => {
      if (
        req.url ===
        'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer'
      ) {
        return JSON.stringify(issuerData);
      }
      return '';
    });

    expect(await fetchAuthIssuer('https://example.com')).toEqual(issuerData);
  });

  it('should re-throw request errors', async () => {
    fetch.mockReject((req) => {
      if (
        req ===
        'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer'
      ) {
        return Promise.reject(new Error('request error'));
      }
      return Promise.resolve();
    });

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('auth_issuer request failed', {
        cause: new Error('request error'),
      }),
    );
  });

  it('should throw response errors', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url ===
        'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer'
      ) {
        return { status: 500, body: 'server error' };
      }
      return '';
    });

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('auth_issuer response not okay', {
        cause: new Error('Server returned 500 error: server error'),
      }),
    );
  });

  it('should re-throw JSON parsing errors', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url ===
        'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer'
      ) {
        return {
          body: '{',
          status: 200,
        };
      }

      return '';
    });

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      'failed to parse auth_issuer response',
    );
  });

  it('should throw an error if the response is invalid', async () => {
    fetch.mockResponse((req) => {
      if (
        req.url ===
        'https://example.com/_matrix/client/unstable/org.matrix.msc2965/auth_issuer'
      ) {
        return {
          body: '{}',
          status: 200,
        };
      }

      return '';
    });

    await expect(fetchAuthIssuer('https://example.com')).rejects.toThrow(
      new Error('invalid auth_issuer response', {
        cause: new Joi.ValidationError('"issuer" is required', [], {}),
      }),
    );
  });
});
