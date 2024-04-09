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
import { ClientPrefix, parseErrorResponse } from 'matrix-js-sdk';

export type AuthIssuerResponse = {
  issuer: string;
};

/**
 * Fetch the auth issuer from the client/server API.
 *
 * @see {@link https://github.com/sandhose/matrix-doc/blob/msc/sandhose/oidc-discovery/proposals/2965-oidc-discovery.md}
 * @throws Error if the fetch fails
 */
export async function fetchAuthIssuer(
  baseUrl: string,
): Promise<AuthIssuerResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${baseUrl}${ClientPrefix.Unstable}/org.matrix.msc2965/auth_issuer`,
    );
  } catch (error) {
    throw new Error('auth_issuer request failed', { cause: error });
  }

  if (!response.ok) {
    const httpError = parseErrorResponse(response, await response.text());
    throw new Error('auth_issuer response not okay', { cause: httpError });
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error('failed to parse auth_issuer response', { cause: error });
  }

  const schema = Joi.object<AuthIssuerResponse>({
    issuer: Joi.string().uri().required(),
  });

  const validationResult = schema.validate(data);

  if (validationResult.error !== undefined) {
    throw new Error('invalid auth_issuer response', {
      cause: validationResult.error,
    });
  }

  return validationResult.value;
}
