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
export function getDeclinedRooms(userId: string): string[] {
  const defaultValue: string[] = [];
  try {
    const key = getDeclinedRoomsKey(userId);
    const value = localStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    const valueParsed = JSON.parse(value);
    return Array.isArray(valueParsed) &&
      !valueParsed.some((item) => typeof item !== 'string')
      ? valueParsed
      : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setDeclinedRooms(
  userId: string,
  declinedRoomIds: string[],
): void {
  const key = getDeclinedRoomsKey(userId);
  if (declinedRoomIds.length > 0) {
    localStorage.setItem(key, JSON.stringify(declinedRoomIds));
  } else {
    localStorage.removeItem(key);
  }
}

function getDeclinedRoomsKey(userId: string): string {
  return `neoboard-declined-rooms-${userId}`;
}
