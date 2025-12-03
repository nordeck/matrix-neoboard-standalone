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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { LoginResponse } from 'matrix-js-sdk';
import {
  attemptCompleteLegacySsoLogin,
  CompleteLoginResponse,
} from './attemptCompleteLegacySsoLogin';
import { completeLegacySsoLogin } from './completeLegacySsoLogin';
import { legacySsoHomeserverUrlStorageKey } from './startLegacySsoLoginFlow';

vi.mock('./completeLegacySsoLogin');

const homeserverUrl = 'https://matrix.example.com';
const loginResponse: LoginResponse = {
  access_token: 'access_token',
  device_id: 'device_id',
  user_id: '@test:example.com',
};
const response: CompleteLoginResponse = {
  homeserverUrl,
  loginResponse,
};

describe('attemptCompleteLegacySsoLogin', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should complete the login if the loginToken and homeserverUrl storage key are set', async () => {
    window.location.href = 'https://example.com/?loginToken=abcd';

    localStorage.setItem(legacySsoHomeserverUrlStorageKey, homeserverUrl);

    vi.mocked(completeLegacySsoLogin).mockResolvedValue(loginResponse);

    expect(await attemptCompleteLegacySsoLogin()).toEqual(response);
  });

  it('should return undefined if no loginToken set', async () => {
    window.location.href = 'https://example.com/';

    localStorage.setItem(legacySsoHomeserverUrlStorageKey, homeserverUrl);

    expect(await attemptCompleteLegacySsoLogin()).toBeUndefined();
  });

  it('should return undefined if no homeserverUrl storage key is set', async () => {
    window.location.href = 'https://example.com/?loginToken=abcd';

    expect(await attemptCompleteLegacySsoLogin()).toBeUndefined();
  });
});
