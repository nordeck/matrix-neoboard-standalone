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
