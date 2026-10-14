/*
 * Copyright 2024-2026 Nordeck IT + Consulting GmbH
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
  RoomEvent,
  RoomMemberStateEventContent,
  StateEvent,
} from '@matrix-widget-toolkit/api';
import {
  DocumentSnapshot,
  ROOM_EVENT_DOCUMENT_SNAPSHOT,
  STATE_EVENT_WHITEBOARD,
  Whiteboard,
} from '@nordeck/matrix-neoboard-react-sdk';
import { EventType, IStateEventWithRoomId } from 'matrix-js-sdk';

let membershipEventId = 1;

type CreateMembershipEventArgs = {
  membership?: RoomMemberStateEventContent['membership'];
  roomId?: string;
  userId?: string;
};

export function createMembershipEvent({
  membership = 'join',
  roomId = '!room:example.com',
  userId = '@user:example.com',
}: CreateMembershipEventArgs): IStateEventWithRoomId {
  return {
    event_id: `membership-${membershipEventId++}`,
    room_id: roomId,
    sender: userId,
    state_key: userId,
    origin_server_ts: Date.now(),
    type: EventType.RoomMember,
    content: {
      membership,
    },
  };
}

let whiteboardEventId = 1;

export function createWhiteboardEvent({
  roomId = '!room:example.com',
  documentId = '$document',
  originServerTs = 0,
}: {
  roomId?: string;
  documentId?: string;
  originServerTs?: number;
} = {}): StateEvent<Whiteboard> {
  return {
    event_id: `whiteboard-${whiteboardEventId++}`,
    room_id: roomId,
    sender: '@user:example.com',
    state_key: `whiteboard-${roomId}`,
    origin_server_ts: originServerTs,
    type: STATE_EVENT_WHITEBOARD,
    content: { documentId },
  };
}

let documentSnapshotEventId = 1;

export function createDocumentSnapshotEvent({
  roomId = '!room:example.com',
  documentId = '$document',
  originServerTs = 0,
}: {
  roomId?: string;
  documentId?: string;
  originServerTs?: number;
} = {}): RoomEvent<DocumentSnapshot> {
  return {
    event_id: `snapshot-${documentSnapshotEventId++}`,
    room_id: roomId,
    sender: '@user:example.com',
    origin_server_ts: originServerTs,
    type: ROOM_EVENT_DOCUMENT_SNAPSHOT,
    content: {
      chunkCount: 1,
      'm.relates_to': { rel_type: 'm.reference', event_id: documentId },
    },
  };
}
