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

import { RoomMemberStateEventContent } from '@matrix-widget-toolkit/api';
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
