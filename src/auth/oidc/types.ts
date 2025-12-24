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
import { IdTokenClaims } from 'oidc-client-ts';

export type OidcCredentials = {
  // this client's id as registered with the OIDC issuer
  clientId: string;
  // issuer used during authentication
  issuer: string;
  // claims of the given access token; used during token refresh to validate new tokens
  idTokenClaims: IdTokenClaims;
};

export const oidcCredentialsSchema = Joi.object<OidcCredentials>({
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
