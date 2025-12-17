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
import { AccessTokens } from 'matrix-js-sdk';
import {
  MatrixClientCredentials,
  matrixClientCredentialsSchema,
  OidcCredentials,
  oidcCredentialsSchema,
} from '../lib/oidc';
import { tryLoadValidatedFromLocalStorage } from '../lib/storage';

export const matrixClientCredentialsStorageKey = 'nd_matrix_client_credentials';
export const oidcCredentialsStorageKey = 'nd_oidc_credentials';
export const matrixCredentialsStorageKey = 'nd_matrix_credentials';

export type MatrixCredentials = {
  userId: string;
  deviceId: string;
};

const matrixCredentialsSchema = Joi.object({
  deviceId: Joi.string().required(),
  userId: Joi.string().required(),
});

/**
 * This class handles the credentials state.
 */
export class Credentials {
  private matrixClientCredentials: MatrixClientCredentials | null = null;
  private oidcCredentials: OidcCredentials | null = null;
  private matrixCredentials: MatrixCredentials | null = null;

  /**
   * Try to restore the credentials from localStorage.
   */
  public start(): void {
    this.matrixClientCredentials = tryLoadValidatedFromLocalStorage(
      matrixClientCredentialsStorageKey,
      matrixClientCredentialsSchema,
    );
    this.oidcCredentials = tryLoadValidatedFromLocalStorage(
      oidcCredentialsStorageKey,
      oidcCredentialsSchema,
    );

    this.matrixCredentials = tryLoadValidatedFromLocalStorage(
      matrixCredentialsStorageKey,
      matrixCredentialsSchema,
    );
  }

  public getMatrixClientCredentials(): MatrixClientCredentials | null {
    return this.matrixClientCredentials;
  }

  public setMatrixClientCredentials(
    matrixClientCredentials: MatrixClientCredentials,
  ): void {
    this.matrixClientCredentials = matrixClientCredentials;
    this.store();
  }

  public getOidcCredentials(): OidcCredentials | null {
    return this.oidcCredentials;
  }

  public setOidcCredentials(oidcCredentials: OidcCredentials): void {
    this.oidcCredentials = oidcCredentials;
    this.store();
  }

  public getMatrixCredentials(): MatrixCredentials | null {
    return this.matrixCredentials;
  }

  public setMatrixCredentials(matrixCredentials: MatrixCredentials): void {
    this.matrixCredentials = matrixCredentials;
    this.store();
  }

  /**
   * Update the access and refresh token.
   *
   * @param accessTokens - Access tokens to update
   * @throws Error if trying to update unset MatrixClient credentials
   */
  public updateAccessTokens(accessTokens: AccessTokens): void {
    if (!this.matrixClientCredentials) {
      throw new Error('tried to update non-existing Matrix Client credentials');
    }

    this.matrixClientCredentials = {
      ...this.matrixClientCredentials,
      accessToken: accessTokens.accessToken,
      refreshToken: accessTokens.refreshToken,
    };
    this.store();
  }

  private store(): void {
    localStorage.setItem(
      matrixClientCredentialsStorageKey,
      JSON.stringify(this.matrixClientCredentials),
    );
    localStorage.setItem(
      oidcCredentialsStorageKey,
      JSON.stringify(this.oidcCredentials),
    );
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(this.matrixCredentials),
    );
  }
}
