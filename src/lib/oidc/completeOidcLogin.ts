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

import { completeAuthorizationCodeGrant } from 'matrix-js-sdk';
import { OidcCodeAndState, OidcCredentials } from './types';

/**
 * Attempt to complete authorization code flow to get an access token
 *
 * Borrowed from {@link https://github.com/matrix-org/matrix-react-sdk/blob/79c50db00993a97a0b6b8c3df02b8eec4e6cb21a/src/utils/oidc/authorize.ts#L102}
 *
 * @param queryParams the query-parameters extracted from the real query-string of the starting URI.
 * @returns Promise that resolves with a CompleteOidcLoginResponse when login was successful
 * @throws When we failed to get a valid access token
 */
export const completeOidcLogin = async (
  codeAndState: OidcCodeAndState,
): Promise<OidcCredentials> => {
  const {
    homeserverUrl,
    tokenResponse,
    idTokenClaims,
    identityServerUrl,
    oidcClientSettings,
  } = await completeAuthorizationCodeGrant(
    codeAndState.code,
    codeAndState.state,
  );

  return {
    homeserverUrl,
    identityServerUrl,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    clientId: oidcClientSettings.clientId,
    issuer: oidcClientSettings.issuer,
    idTokenClaims,
  };
};
