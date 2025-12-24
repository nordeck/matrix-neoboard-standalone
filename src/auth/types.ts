/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

export type MatrixClientCredentials = {
  // url of the homeserver selected during login
  homeserverUrl: string;
  // identity server url as discovered during login
  identityServerUrl?: string;
  // accessToken gained from OIDC token issuer
  accessToken: string;
  // refreshToken gained from OIDC token issuer, when falsy token cannot be refreshed
  refreshToken?: string;
};

export const matrixClientCredentialsSchema =
  Joi.object<MatrixClientCredentials>({
    homeserverUrl: Joi.string().uri().required(),
    identityServerUrl: Joi.string().uri(),
    accessToken: Joi.string(),
    refreshToken: Joi.string(),
  });

export type MatrixCredentials = {
  userId: string;
  deviceId: string;
};

export const matrixCredentialsSchema = Joi.object({
  deviceId: Joi.string().required(),
  userId: Joi.string().required(),
});
