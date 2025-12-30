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
import { LoginResponse } from 'matrix-js-sdk';
import { completeLegacySsoLogin } from './completeLegacySsoLogin';
import { legacySsoHomeserverUrlStorageKey } from './startLegacySsoLoginFlow';

export type CompleteLoginResponse = {
  homeserverUrl: string;
  loginResponse: LoginResponse;
};

/**
 * Try to complete legacy SSO login if the "loginToken" and homeserver URL key are set.
 *
 * @returns Promise that resolves to homeserverUrl and LoginResponse tuple on success,
 * undefined otherwise
 */
export async function attemptCompleteLegacySsoLogin(): Promise<
  CompleteLoginResponse | undefined
> {
  const loginToken = new URL(window.location.href).searchParams.get(
    'loginToken',
  );
  const homeserverUrl = localStorage.getItem(legacySsoHomeserverUrlStorageKey);

  if (!loginToken || !homeserverUrl) {
    return undefined;
  }

  // Delete authentication params
  window.history.replaceState(null, '', window.location.pathname);

  // Delete homeserver URL stored
  localStorage.removeItem(legacySsoHomeserverUrlStorageKey);

  const loginResponse = await completeLegacySsoLogin({
    homeserverUrl,
    loginToken,
  });

  if (!loginResponse) {
    return undefined;
  }

  return {
    homeserverUrl,
    loginResponse,
  };
}
