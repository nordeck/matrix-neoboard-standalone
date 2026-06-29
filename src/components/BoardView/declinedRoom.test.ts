/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
import { beforeEach, describe, expect, it } from 'vitest';
import { getDeclinedRooms, setDeclinedRooms } from './declinedRoom';

beforeEach(() => {
  localStorage.clear();
});

describe('getDeclinedRooms', () => {
  it('should get from local storage', () => {
    localStorage.setItem(
      'neoboard-declined-rooms-@alice:example.com',
      JSON.stringify(['!room-id:example.org']),
    );

    expect(getDeclinedRooms('@alice:example.com')).toEqual([
      '!room-id:example.org',
    ]);
  });

  it('should return empty array if no declined rooms for user in local storage', () => {
    expect(getDeclinedRooms('@alice:example.com')).toEqual([]);
  });

  it('should return empty array if value stored in local storage is not array', () => {
    localStorage.setItem(
      'neoboard-declined-rooms-@alice:example.com',
      JSON.stringify({}),
    );

    expect(getDeclinedRooms('@alice:example.com')).toEqual([]);
  });

  it('should return empty array if value stored in local storage is not array of strings', () => {
    localStorage.setItem(
      'neoboard-declined-rooms-@alice:example.com',
      JSON.stringify(['!room-id:example.org', 1]),
    );

    expect(getDeclinedRooms('@alice:example.com')).toEqual([]);
  });
});

describe('setDeclinedRooms', () => {
  it('should set to local storage', () => {
    setDeclinedRooms('@alice:example.com', ['!room-id:example.org']);
    expect(
      localStorage.getItem('neoboard-declined-rooms-@alice:example.com'),
    ).toEqual('["!room-id:example.org"]');
  });

  it('should remove from local storage if empty array is set', () => {
    setDeclinedRooms('@alice:example.com', ['!room-id:example.org']);
    setDeclinedRooms('@alice:example.com', []);

    expect(
      localStorage.getItem('neoboard-declined-rooms-@alice:example.com'),
    ).toBe(null);
  });
});
