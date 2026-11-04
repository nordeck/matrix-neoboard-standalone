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

import {
  mockDocumentSnapshot,
  mockWhiteboard,
} from '@nordeck/matrix-neoboard-react-sdk/src/lib/testUtils/matrixTestUtils';
import { describe, expect, it } from 'vitest';
import {
  createBoardComparator,
  getModifiedTimestamp,
  WhiteboardEntry,
} from './selectWhiteboards';

function createEntry({
  roomName,
  createdAt,
  modifiedAt,
}: {
  roomName: string;
  createdAt: number;
  modifiedAt?: number;
}): WhiteboardEntry {
  return {
    roomName,
    whiteboard: mockWhiteboard({ origin_server_ts: createdAt }),
    whiteboardSessions: undefined,
    powerLevels: undefined,
    roomCreateEvent: undefined,
    latestSnapshot:
      modifiedAt === undefined
        ? undefined
        : mockDocumentSnapshot({ origin_server_ts: modifiedAt }).snapshot,
    preview: undefined,
  };
}

describe('getModifiedTimestamp', () => {
  it('should use the timestamp of the latest snapshot', () => {
    expect(
      getModifiedTimestamp(
        createEntry({ roomName: 'A', createdAt: 1000, modifiedAt: 5000 }),
      ),
    ).toBe(5000);
  });

  it('should fall back to the creation of the whiteboard', () => {
    expect(
      getModifiedTimestamp(createEntry({ roomName: 'A', createdAt: 1000 })),
    ).toBe(1000);
  });
});

describe('createBoardComparator', () => {
  const entries = [
    createEntry({ roomName: 'A', createdAt: 1000, modifiedAt: 2000 }),
    createEntry({ roomName: 'B', createdAt: 3000 }),
    createEntry({ roomName: 'C', createdAt: 500, modifiedAt: 4000 }),
  ];

  it.each([
    ['modified', 'desc', ['C', 'B', 'A']],
    ['modified', 'asc', ['A', 'B', 'C']],
    ['created', 'desc', ['B', 'A', 'C']],
    ['created', 'asc', ['C', 'A', 'B']],
    ['name', 'asc', ['A', 'B', 'C']],
    ['name', 'desc', ['C', 'B', 'A']],
  ] as const)('should sort by %s %s', (sortBy, sortDirection, expected) => {
    const sorted = [...entries].sort(
      createBoardComparator(sortBy, sortDirection),
    );

    expect(sorted.map((entry) => entry.roomName)).toEqual(expected);
  });
});
