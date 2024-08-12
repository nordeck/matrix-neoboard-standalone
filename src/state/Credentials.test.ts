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

import { beforeEach, describe, expect, it } from 'vitest';
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
