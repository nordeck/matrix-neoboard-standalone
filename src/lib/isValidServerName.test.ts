// SPDX-License-Identifier: AGPL-3.0-or-later

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

import { describe, expect, it } from 'vitest';
import { isValidServerName } from './isValidServerName';

describe('isValidServerName', () => {
  it.each([
    ['matrix.example.com', true],
    ['example.org', true],
    ['my-server.net', true],
    ['https://matrix.example.com', true],
    ['http://example.org', true],
  ])(
    'should return true for valid server name: "%s"',
    (serverName, expected) => {
      expect(isValidServerName(serverName)).toBe(expected);
    },
  );

  it.each([
    [undefined, false],
    ['', false],
    [' ', false],
    ['  ', false],
    ['\t', false],
    ['\n', false],
    ['   \t\n   ', false],
    ['.com', false],
    ['com.', false],
    ['example', false],
    ['http://example', false],
    ['http://.com', false],
    ['http://com.', false],
  ])(
    'should return false for invalid server name: %s',
    (serverName, expected) => {
      expect(isValidServerName(serverName)).toBe(expected);
    },
  );

  it('should work as a type guard', () => {
    const serverName: string | undefined = 'matrix.example.com';

    if (isValidServerName(serverName)) {
      expect(serverName.length).toBeGreaterThan(0);
      expect(typeof serverName).toBe('string');
    }
  });
});
