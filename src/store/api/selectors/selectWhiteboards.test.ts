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

import { documentSnapshotApi } from '@nordeck/matrix-neoboard-react-sdk';
import { describe, expect, it } from 'vitest';
import {
  createDocumentSnapshotEvent,
  createWhiteboardEvent,
} from '../../../lib/test';
import { createStore } from '../../store';
import { whiteboardApi } from '../whiteboardApi';
import {
  createBoardComparator,
  getModifiedTimestamp,
  selectLatestSnapshots,
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
    whiteboard: createWhiteboardEvent({ originServerTs: createdAt }),
    whiteboardSessions: undefined,
    powerLevels: undefined,
    roomCreateEvent: undefined,
    latestSnapshot:
      modifiedAt === undefined
        ? undefined
        : createDocumentSnapshotEvent({ originServerTs: modifiedAt }),
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

describe('selectLatestSnapshots', () => {
  it('should select the loaded snapshots', async () => {
    const store = createStore({
      standaloneApi: new Promise(() => {}),
      widgetApi: new Promise(() => {}),
    });
    const whiteboard1 = createWhiteboardEvent({
      roomId: '!room-1',
      documentId: '$document-1',
    });
    const whiteboard2 = createWhiteboardEvent({
      roomId: '!room-2',
      documentId: '$document-2',
    });
    const snapshot1 = createDocumentSnapshotEvent({
      roomId: '!room-1',
      documentId: '$document-1',
    });

    await store.dispatch(
      whiteboardApi.util.upsertQueryData('getWhiteboardsAll', undefined, {
        ids: [whiteboard1.state_key, whiteboard2.state_key],
        entities: {
          [whiteboard1.state_key]: whiteboard1,
          [whiteboard2.state_key]: whiteboard2,
        },
      }),
    );
    await store.dispatch(
      documentSnapshotApi.util.upsertQueryData(
        'getDocumentSnapshot',
        { documentId: '$document-1' },
        { event: snapshot1, data: '' },
      ),
    );

    const latestSnapshots = selectLatestSnapshots(store.getState());
    expect(latestSnapshots).toEqual({ '$document-1': snapshot1 });

    expect(selectLatestSnapshots(store.getState())).toBe(latestSnapshots);
  });
});
