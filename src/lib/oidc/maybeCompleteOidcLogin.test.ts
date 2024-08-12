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

import { describe, expect, it, vi } from 'vitest';
import { createOidcTestCredentials } from '../testUtils';
import { completeOidcLogin } from './completeOidcLogin';
import { maybeCompleteOidcLogin } from './maybeCompleteOidcLogin';

vi.mock('./completeOidcLogin');

const oidcTestCredentials = createOidcTestCredentials();

describe('maybeCompleteOidcLogin', () => {
  it('should return null if no query params are set', async () => {
    window.location.href = 'https://example.com/';
    expect(await maybeCompleteOidcLogin()).toBeNull();
  });

  it('should return null if only the "code" query params is set', async () => {
    window.location.href = 'https://example.com/?code=test_code';
    expect(await maybeCompleteOidcLogin()).toBeNull();
  });

  it('should return null if only the "state" query params is set', async () => {
    window.location.href = 'https://example.com/?state=test_state';
    expect(await maybeCompleteOidcLogin()).toBeNull();
  });

  it('should return complete the login if the "code" and "state" query params are set', async () => {
    window.location.href =
      'https://example.com/?code=test_code&state=test_state';

    vi.mocked(completeOidcLogin).mockResolvedValue(oidcTestCredentials);

    expect(await maybeCompleteOidcLogin()).toBe(oidcTestCredentials);
    expect(completeOidcLogin).toHaveBeenCalledWith({
      code: 'test_code',
      state: 'test_state',
    });
  });
});
