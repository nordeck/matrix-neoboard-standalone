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

import { beforeEach, describe, expect, it } from 'vitest';
import {
  mockMatrixClientCredentials,
  mockMatrixCredentials,
  mockOidcCredentials,
} from '../lib/testUtils';
import {
  Credentials,
  matrixClientCredentialsStorageKey,
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from './Credentials';

const matrixCredentials = mockMatrixCredentials();
const matrixClientCredentials = mockMatrixClientCredentials();
const oidcCredentials = mockOidcCredentials();

describe('Credentials', () => {
  let credentials: Credentials;

  beforeEach(() => {
    credentials = new Credentials();
  });

  describe('start', () => {
    it('should restore credentials from localStorage', () => {
      localStorage.setItem(
        matrixCredentialsStorageKey,
        JSON.stringify(matrixCredentials),
      );
      localStorage.setItem(
        oidcCredentialsStorageKey,
        JSON.stringify(oidcCredentials),
      );

      credentials.start();

      expect(credentials.getMatrixCredentials()).toEqual(matrixCredentials);
      expect(credentials.getOidcCredentials()).toEqual(oidcCredentials);
    });
  });

  describe('setMatrixCredentials', () => {
    it('should set the Matrix credentials', () => {
      credentials.setMatrixCredentials(matrixCredentials);
      expect(credentials.getMatrixCredentials()).toBe(matrixCredentials);
    });

    it('should store the Matrix credentials', () => {
      credentials.setMatrixCredentials(matrixCredentials);
      expect(localStorage.getItem(matrixCredentialsStorageKey)).toEqual(
        JSON.stringify(matrixCredentials),
      );
    });
  });

  describe('setOidcCredentials', () => {
    it('should set the OIDC credentials', () => {
      credentials.setOidcCredentials(oidcCredentials);
      expect(credentials.getOidcCredentials()).toBe(oidcCredentials);
    });

    it('should store the OIDC credentials', () => {
      credentials.setOidcCredentials(oidcCredentials);
      expect(localStorage.getItem(oidcCredentialsStorageKey)).toEqual(
        JSON.stringify(oidcCredentials),
      );
    });
  });

  describe('updateAccessTokens', () => {
    const newAccessTokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    it('should raise an error if credentials have not yet been initialised', () => {
      expect(() => {
        credentials.updateAccessTokens(newAccessTokens);
      }).toThrow('tried to update non-existing Matrix Client credentials');
    });

    it('should update the access tokens', () => {
      credentials.setMatrixClientCredentials(matrixClientCredentials);
      credentials.updateAccessTokens(newAccessTokens);

      expect(credentials.getMatrixClientCredentials()).toEqual({
        ...matrixClientCredentials,
        ...newAccessTokens,
      });
    });

    it('should store the updated credentials', () => {
      credentials.setMatrixClientCredentials(matrixClientCredentials);
      credentials.updateAccessTokens(newAccessTokens);

      expect(localStorage.getItem(matrixClientCredentialsStorageKey)).toEqual(
        JSON.stringify({
          ...matrixClientCredentials,
          ...newAccessTokens,
        }),
      );
    });
  });
});
