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

import Joi from 'joi';
import { AccessTokens } from 'matrix-js-sdk';
import { OidcCredentials, oidcCredentialsSchema } from '../lib/oidc';
import { tryLoadValidatedFromLocalStorage } from '../lib/storage';

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
   * @throws Error if trying to update unset OIDC credentials
   */
  public updateAccessTokens(accessTokens: AccessTokens): void {
    if (!this.oidcCredentials) {
      throw new Error('tried to update non-existing OIDC credentials');
    }

    this.oidcCredentials = {
      ...this.oidcCredentials,
      accessToken: accessTokens.accessToken,
      refreshToken: accessTokens.refreshToken,
    };
    this.store();
  }

  private store(): void {
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
