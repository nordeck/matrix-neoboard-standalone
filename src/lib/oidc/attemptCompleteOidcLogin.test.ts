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

import { describe, expect, it, vi } from 'vitest';
import { mockOidcLoginResponse } from '../testUtils';
import { attemptCompleteOidcLogin } from './attemptCompleteOidcLogin';
import { completeOidcLogin } from './completeOidcLogin';

vi.mock('./completeOidcLogin');

const oidcLoginResponse = mockOidcLoginResponse();

describe('attemptCompleteOidcLogin', () => {
  it('should return null if no query params are set', async () => {
    window.location.href = 'https://example.com/';
    expect(await attemptCompleteOidcLogin()).toBeNull();
  });

  it('should return null if only the "code" query params is set', async () => {
    window.location.href = 'https://example.com/?code=test_code';
    expect(await attemptCompleteOidcLogin()).toBeNull();
  });

  it('should return null if only the "state" query params is set', async () => {
    window.location.href = 'https://example.com/?state=test_state';
    expect(await attemptCompleteOidcLogin()).toBeNull();
  });

  it('should return complete the login if the "code" and "state" query params are set', async () => {
    window.location.href =
      'https://example.com/?code=test_code&state=test_state';

    vi.mocked(completeOidcLogin).mockResolvedValue(oidcLoginResponse);

    expect(await attemptCompleteOidcLogin()).toBe(oidcLoginResponse);
    expect(completeOidcLogin).toHaveBeenCalledWith({
      code: 'test_code',
      state: 'test_state',
    });
  });
});
