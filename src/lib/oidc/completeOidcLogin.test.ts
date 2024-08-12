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
import { describe, expect, it, vi } from 'vitest';
import { createOidcTestCredentials } from '../testUtils';
import { completeOidcLogin } from './completeOidcLogin';
import { OidcCodeAndState } from './types';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  completeAuthorizationCodeGrant: vi.fn(),
}));

const oidcTestCredentials = createOidcTestCredentials();

describe('completeOidcLogin', () => {
  it('should forward the call to the Matrix JS SDK', async () => {
    const codeAndState: OidcCodeAndState = {
      state: 'oidc_test_state',
      code: 'oidc_test_code',
    };

    vi.mocked(completeAuthorizationCodeGrant).mockResolvedValue({
      homeserverUrl: oidcTestCredentials.homeserverUrl,
      idTokenClaims: oidcTestCredentials.idTokenClaims,
      oidcClientSettings: {
        issuer: oidcTestCredentials.issuer,
        clientId: oidcTestCredentials.clientId,
      },
      tokenResponse: {
        access_token: oidcTestCredentials.accessToken,
        refresh_token: oidcTestCredentials.refreshToken,
        token_type: 'Bearer',
        scope: 'oidc',
      },
    });

    expect(await completeOidcLogin(codeAndState)).toEqual(oidcTestCredentials);
    expect(completeAuthorizationCodeGrant).toHaveBeenCalledWith(
      codeAndState.code,
      codeAndState.state,
    );
  });
});
