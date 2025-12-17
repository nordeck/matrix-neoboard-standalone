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
import { createClient, LoginResponse, MatrixClient } from 'matrix-js-sdk';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from 'vitest';
import { completeLegacySsoLogin } from './completeLegacySsoLogin';

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  createClient: vi.fn(),
}));

describe('attemptCompleteLegacySsoLogin', () => {
  const loginResponse: LoginResponse = {
    access_token: 'access_token',
    device_id: 'device_id',
    user_id: '@test:example.com',
  };

  let consoleWarnSpy: MockInstance;
  let matrixClient: MatrixClient;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn');

    matrixClient = {
      loginRequest: vi.fn(),
    } as unknown as MatrixClient;
    vi.mocked(createClient).mockReturnValue(matrixClient);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should complete legacy sso login with the token', async () => {
    vi.mocked(matrixClient.loginRequest).mockResolvedValue(loginResponse);

    expect(
      await completeLegacySsoLogin({
        homeserverUrl: 'https://matrix.example.com',
        loginToken: 'sample_token',
      }),
    ).toBe(loginResponse);

    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: 'https://matrix.example.com',
      }),
    );
    expect(matrixClient.loginRequest).toHaveBeenCalledWith({
      token: 'sample_token',
      type: 'm.login.token',
    });
  });

  it('should return undefined in case of error', async () => {
    vi.mocked(console.warn).mockImplementation(() => {});

    vi.mocked(matrixClient.loginRequest).mockRejectedValue(
      new Error('Unexpected token'),
    );

    expect(
      await completeLegacySsoLogin({
        homeserverUrl: 'https://matrix.example.com',
        loginToken: 'sample_token',
      }),
    ).toBeUndefined();
  });
});
