// SPDX-License-Identifier: AGPL-3.0-or-later

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
