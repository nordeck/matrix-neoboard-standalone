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
