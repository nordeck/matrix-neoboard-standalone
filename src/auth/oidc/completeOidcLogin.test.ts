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

import { completeAuthorizationCodeGrant } from 'matrix-js-sdk';
import { describe, expect, it, vi } from 'vitest';
import {
  mockMatrixCredentials,
  mockOidcCredentials,
  mockOidcLoginResponse,
} from '../../lib/testUtils';
import { completeOidcLogin } from './completeOidcLogin';
import { OidcCodeAndState } from './types';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  completeAuthorizationCodeGrant: vi.fn(),
}));

const matrixCredentials = mockMatrixCredentials();
const oidcTestCredentials = mockOidcCredentials();
const oidcLoginResponse = mockOidcLoginResponse();

describe('completeOidcLogin', () => {
  it('should forward the call to the Matrix JS SDK', async () => {
    const codeAndState: OidcCodeAndState = {
      state: 'oidc_test_state',
      code: 'oidc_test_code',
    };

    vi.mocked(completeAuthorizationCodeGrant).mockResolvedValue({
      homeserverUrl: matrixCredentials.homeserverUrl,
      idTokenClaims: oidcTestCredentials.idTokenClaims,
      oidcClientSettings: {
        issuer: oidcTestCredentials.issuer,
        clientId: oidcTestCredentials.clientId,
      },
      tokenResponse: {
        access_token: matrixCredentials.accessToken,
        refresh_token: matrixCredentials.refreshToken,
        token_type: 'Bearer',
        scope: 'oidc',
        id_token: 'oidc_test_id_token',
      },
    });

    expect(await completeOidcLogin(codeAndState)).toEqual(oidcLoginResponse);
    expect(completeAuthorizationCodeGrant).toHaveBeenCalledWith(
      codeAndState.code,
      codeAndState.state,
    );
  });
});
