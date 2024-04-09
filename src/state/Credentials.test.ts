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

import {
  createMatrixTestCredentials,
  createOidcTestCredentials,
} from '../lib/testUtils';
import {
  Credentials,
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from './Credentials';

const matrixTestCredentials = createMatrixTestCredentials();
const oidcTestCredentials = createOidcTestCredentials();

describe('Credentials', () => {
  let credentials: Credentials;

  beforeEach(() => {
    credentials = new Credentials();
  });

  describe('start', () => {
    it('should restore credentials from localStorage', () => {
      localStorage.setItem(
        matrixCredentialsStorageKey,
        JSON.stringify(matrixTestCredentials),
      );
      localStorage.setItem(
        oidcCredentialsStorageKey,
        JSON.stringify(oidcTestCredentials),
      );

      credentials.start();

      expect(credentials.getMatrixCredentials()).toEqual(matrixTestCredentials);
      expect(credentials.getOidcCredentials()).toEqual(oidcTestCredentials);
    });
  });

  describe('setMatrixCredentials', () => {
    it('should set the Matrix credentials', () => {
      credentials.setMatrixCredentials(matrixTestCredentials);
      expect(credentials.getMatrixCredentials()).toBe(matrixTestCredentials);
    });

    it('should store the Matrix credentials', () => {
      credentials.setMatrixCredentials(matrixTestCredentials);
      expect(localStorage.getItem(matrixCredentialsStorageKey)).toEqual(
        JSON.stringify(matrixTestCredentials),
      );
    });
  });

  describe('setOidcCredentials', () => {
    it('should set the OIDC credentials', () => {
      credentials.setOidcCredentials(oidcTestCredentials);
      expect(credentials.getOidcCredentials()).toBe(oidcTestCredentials);
    });

    it('should store the OIDC credentials', () => {
      credentials.setOidcCredentials(oidcTestCredentials);
      expect(localStorage.getItem(oidcCredentialsStorageKey)).toEqual(
        JSON.stringify(oidcTestCredentials),
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
      }).toThrow('tried to update non-existing OIDC credentials');
    });

    it('should update the access tokens', () => {
      credentials.setOidcCredentials(oidcTestCredentials);
      credentials.updateAccessTokens(newAccessTokens);

      expect(credentials.getOidcCredentials()).toEqual({
        ...oidcTestCredentials,
        ...newAccessTokens,
      });
    });

    it('should store the updated credentials', () => {
      credentials.setOidcCredentials(oidcTestCredentials);
      credentials.updateAccessTokens(newAccessTokens);

      expect(localStorage.getItem(oidcCredentialsStorageKey)).toEqual(
        JSON.stringify({
          ...oidcTestCredentials,
          ...newAccessTokens,
        }),
      );
    });
  });
});
