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
