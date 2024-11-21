/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';
import { selectAllRoomNameEventEntities } from '../roomNameApi';

export type InviteEntry = {
  roomId: string;
  roomName?: string;
  senderUserId: string;
  senderDisplayName?: string | null;
};

export function makeSelectInvites(
  userId: string,
): (state: RootState) => InviteEntry[] {
  return createSelector(
    selectAllRoomMemberEventEntities,
    selectAllRoomNameEventEntities,
    (roomMemberEvents, roomNameEvents): InviteEntry[] => {
      const invites: InviteEntry[] = Object.values(roomMemberEvents)
        .filter((event) => event.state_key === userId)
        .filter((event) => event.content.membership === 'invite')
        .map((event) => {
          const senderMembershipEvent = Object.values(roomMemberEvents).find(
            (e) => e.state_key === event.sender && e.room_id === event.room_id,
          );
          const roomNameEvent = Object.values(roomNameEvents).find(
            (e) => e.room_id === event.room_id,
          );
          return {
            roomId: event.room_id,
            roomName: roomNameEvent?.content.name,
            senderUserId: event.sender,
            senderDisplayName: senderMembershipEvent?.content.displayname,
          };
        });
      return invites;
    },
  );
}
