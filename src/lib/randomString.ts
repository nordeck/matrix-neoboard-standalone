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

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

/**
 * Create a random string.
 *
 * Borrowed from {@link https://github.com/matrix-org/matrix-js-sdk/blob/afc3c6213b4f9aa80c54782bd6863d80a86156ef/src/randomstring.ts#L32}
 *
 * @param len - Length of the random string
 * @returns Random string of the given length consisting of upper-/lower-case letters and digits.
 */
export function randomString(len: number): string {
  return randomStringFrom(len, UPPERCASE + LOWERCASE + DIGITS);
}

function randomStringFrom(len: number, chars: string): string {
  let ret = '';

  for (let i = 0; i < len; ++i) {
    ret += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ret;
}
