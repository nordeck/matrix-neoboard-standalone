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

import { AccessTokens } from 'matrix-js-sdk';
import {
  MatrixCredentials,
  matrixCredentialsSchema,
  OidcCredentials,
  oidcCredentialsSchema,
} from '../auth';
import { tryLoadValidatedFromLocalStorage } from '../lib/storage';

export const oidcCredentialsStorageKey = 'nd_oidc_credentials';
export const matrixCredentialsStorageKey = 'nd_matrix_credentials';

/**
 * This class handles the credentials state.
 */
export class Credentials {
  private oidcCredentials: OidcCredentials | null = null;
  private matrixCredentials: MatrixCredentials | null = null;

  /**
   * Try to restore the credentials from localStorage.
   */
  public start(): void {
    this.oidcCredentials = tryLoadValidatedFromLocalStorage(
      oidcCredentialsStorageKey,
      oidcCredentialsSchema,
    );
    this.matrixCredentials = tryLoadValidatedFromLocalStorage(
      matrixCredentialsStorageKey,
      matrixCredentialsSchema,
    );
  }

  public getOidcCredentials(): OidcCredentials | null {
    return this.oidcCredentials;
  }

  public setOidcCredentials(oidcCredentials: OidcCredentials): void {
    this.oidcCredentials = oidcCredentials;
    this.storeOidcCredentials();
  }

  public getMatrixCredentials(): MatrixCredentials | null {
    return this.matrixCredentials;
  }

  public setMatrixCredentials(matrixCredentials: MatrixCredentials): void {
    this.matrixCredentials = matrixCredentials;
    this.storeMatrixCredentials();
  }

  /**
   * Update the access and refresh token.
   *
   * @param accessTokens - Access tokens to update
   * @throws Error if trying to update unset MatrixClient credentials
   */
  public updateAccessTokens(accessTokens: AccessTokens): void {
    if (!this.matrixCredentials) {
      throw new Error('tried to update non-existing Matrix Client credentials');
    }

    this.matrixCredentials = {
      ...this.matrixCredentials,
      accessToken: accessTokens.accessToken,
      refreshToken: accessTokens.refreshToken,
    };
    this.storeMatrixCredentials();
  }

  private storeOidcCredentials(): void {
    localStorage.setItem(
      oidcCredentialsStorageKey,
      JSON.stringify(this.oidcCredentials),
    );
  }

  private storeMatrixCredentials(): void {
    localStorage.setItem(
      matrixCredentialsStorageKey,
      JSON.stringify(this.matrixCredentials),
    );
  }
}
