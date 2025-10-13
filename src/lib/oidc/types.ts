// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import Joi from 'joi';
import { IdTokenClaims } from 'oidc-client-ts';

/**
 * Borrowed from {@link https://github.com/matrix-org/matrix-react-sdk/blob/79c50db00993a97a0b6b8c3df02b8eec4e6cb21a/src/utils/oidc/authorize.ts#L80}
 */
export type OidcCredentials = {
  // url of the homeserver selected during login
  homeserverUrl: string;
  // identity server url as discovered during login
  identityServerUrl?: string;
  // accessToken gained from OIDC token issuer
  accessToken: string;
  // refreshToken gained from OIDC token issuer, when falsy token cannot be refreshed
  refreshToken?: string;
  // this client's id as registered with the OIDC issuer
  clientId: string;
  // issuer used during authentication
  issuer: string;
  // claims of the given access token; used during token refresh to validate new tokens
  idTokenClaims: IdTokenClaims;
};

export const oidcCredentialsSchema = Joi.object<OidcCredentials>({
  homeserverUrl: Joi.string().uri().required(),
  identityServerUrl: Joi.string().uri(),
  accessToken: Joi.string(),
  refreshToken: Joi.string(),
  clientId: Joi.string().required(),
  issuer: Joi.string().uri().required(),
  idTokenClaims: Joi.object({
    c_hash: Joi.string(),
    exp: Joi.number().required(),
    sub: Joi.string().required(),
    iss: Joi.string().uri().required(),
    aud: Joi.string().required(),
    iat: Joi.number().required(),
  }).required(),
});

export type OidcCodeAndState = {
  code: string;
  state: string;
};

export const oidcCodeAndStateSchema = Joi.object<OidcCodeAndState>({
  code: Joi.string().required(),
  state: Joi.string().required(),
});
