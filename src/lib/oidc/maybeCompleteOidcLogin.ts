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

import { completeOidcLogin } from './completeOidcLogin';
import {
  OidcCodeAndState,
  OidcCredentials,
  oidcCodeAndStateSchema,
} from './types';

/**
 * Try to complete an OIDC login if the "code" and "state" query params are set.
 *
 * @returns Promise that resolves to OidcCredentials on success or
 *          null if "code" or "state" are not set.
 */
export async function maybeCompleteOidcLogin(): Promise<OidcCredentials | null> {
  const codeAndState = parseValidatedCodeAndStateFromQueryParams(
    new URL(window.location.href).searchParams,
  );

  if (codeAndState === null) {
    return null;
  }

  // If code and state stay in the URL a client may navigate back to it or bookmark it.
  // Prevent this by removing all query params after an OIDC login.
  window.history.replaceState(null, '', window.location.pathname);

  return await completeOidcLogin(codeAndState);
}

function parseValidatedCodeAndStateFromQueryParams(
  queryParams: URLSearchParams,
): OidcCodeAndState | null {
  const rawCodeAndState = {
    code: queryParams.get('code'),
    state: queryParams.get('state'),
  };

  const validationResult = oidcCodeAndStateSchema.validate(rawCodeAndState);

  if (validationResult.error !== undefined) {
    return null;
  }

  return validationResult.value;
}
