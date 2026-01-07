/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { MatrixClient } from 'matrix-js-sdk';
import { describe, expect, it, vi } from 'vitest';
import {
  legacySsoHomeserverUrlStorageKey,
  startLegacySsoLoginFlow,
} from './startLegacySsoLoginFlow';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  MatrixClient: vi.fn(),
}));

describe('startLegacySsoLoginFlow', () => {
  const ssoLoginUrl =
    'https://id.example.com/realms/test/protocol/openid-connect/auth';

  it('should start the login flow with homeserver url', async () => {
    const matrixClient = {
      getSsoLoginUrl: vi.fn(),
    } as unknown as MatrixClient;
    vi.mocked(MatrixClient).mockReturnValue(matrixClient);

    vi.mocked(matrixClient).getSsoLoginUrl.mockReturnValue(ssoLoginUrl);

    window.location.href = 'https://neoboard.example.com/board/id';
    await startLegacySsoLoginFlow('https://matrix.example.com');

    expect(MatrixClient).toHaveBeenCalledWith({
      baseUrl: 'https://matrix.example.com',
    });
    expect(matrixClient.getSsoLoginUrl).toHaveBeenCalledWith(
      'https://neoboard.example.com/board/id',
      'sso',
    );
    expect(localStorage.getItem(legacySsoHomeserverUrlStorageKey)).toBe(
      'https://matrix.example.com',
    );
    expect(window.location.href).toEqual(ssoLoginUrl);
  });
});
