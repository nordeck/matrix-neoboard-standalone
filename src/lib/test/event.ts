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

import {
  RoomMemberStateEventContent,
  STATE_EVENT_ROOM_MEMBER,
  StateEvent,
} from '@matrix-widget-toolkit/api';
import {
  STATE_EVENT_ROOM_NAME,
  STATE_EVENT_WHITEBOARD,
} from '@nordeck/matrix-neoboard-react-sdk';
import { EventType, IStateEventWithRoomId } from 'matrix-js-sdk';

const defaultRoomId = '!room:example.com';
const defaultUserId = '@user:example.com';

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

type CreateStateEventArgs = {
  roomId?: string;
  userId?: string;
  originServerTs?: number;
};

export function createWhiteboardStateEvent({
  roomId = defaultRoomId,
  userId = defaultUserId,
  originServerTs = 0,
  documentId = 'document-1',
}: CreateStateEventArgs & { documentId?: string } = {}): StateEvent {
  return {
    type: STATE_EVENT_WHITEBOARD,
    room_id: roomId,
    state_key: `whiteboard-${roomId}`,
    origin_server_ts: originServerTs,
    event_id: `$whiteboard-${roomId}`,
    sender: userId,
    content: { documentId },
  };
}

export function createRoomNameStateEvent({
  roomId = defaultRoomId,
  userId = defaultUserId,
  originServerTs = 0,
  name = 'Test Board',
}: CreateStateEventArgs & { name?: string } = {}): StateEvent {
  return {
    type: STATE_EVENT_ROOM_NAME,
    room_id: roomId,
    state_key: '',
    origin_server_ts: originServerTs,
    event_id: `$name-${roomId}`,
    sender: userId,
    content: { name },
  };
}

export function createRoomMemberStateEvent({
  roomId = defaultRoomId,
  userId = defaultUserId,
  originServerTs = 0,
  membership = 'join',
}: CreateStateEventArgs & {
  membership?: RoomMemberStateEventContent['membership'];
} = {}): StateEvent {
  return {
    type: STATE_EVENT_ROOM_MEMBER,
    room_id: roomId,
    state_key: userId,
    origin_server_ts: originServerTs,
    event_id: `$member-${roomId}-${userId}`,
    sender: userId,
    content: { membership },
  };
}
