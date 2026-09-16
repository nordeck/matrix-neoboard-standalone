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

import { completeOidcLogin } from './completeOidcLogin';
import {
  OidcCodeAndState,
  oidcCodeAndStateSchema,
  OidcLoginResponse,
} from './types';

/**
 * Try to complete an OIDC login if the "code" and "state" params are set
 * in the URL fragment (hash). The IdP returns them via response_mode=fragment.
 *
 * @returns Promise that resolves to OidcCredentials on success or
 *          null if "code" or "state" are not set.
 */
export async function attemptCompleteOidcLogin(): Promise<OidcLoginResponse | null> {
  const url = new URL(window.location.href);
  const codeAndState = parseValidatedCodeAndState(
    new URLSearchParams(url.hash.slice(1)),
  );

  if (codeAndState === null) {
    return null;
  }

  // If code and state stay in the URL a client may navigate back to it or bookmark it.
  // Prevent this by removing all query params and the fragment after an OIDC login.
  window.history.replaceState(null, '', window.location.pathname);

  return await completeOidcLogin(codeAndState);
}

function parseValidatedCodeAndState(
  params: URLSearchParams,
): OidcCodeAndState | null {
  const rawCodeAndState = {
    code: params.get('code'),
    state: params.get('state'),
  };

  const validationResult = oidcCodeAndStateSchema.validate(rawCodeAndState);

  if (validationResult.error !== undefined) {
    return null;
  }

  return validationResult.value;
}
