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

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';

export type MemberEntry = {
  roomId: string;
  userId: string;
  userDisplayName?: string | null;
};

export function makeSelectMembers(
  roomId: string,
): (state: RootState) => MemberEntry[] {
  return createSelector(
    selectAllRoomMemberEventEntities,
    (roomMemberEvents): MemberEntry[] => {
      const members: MemberEntry[] = Object.values(roomMemberEvents)
        .filter((event) => event.content.membership === 'join')
        .filter((event) => event.room_id === roomId)
        .map((event) => {
          const senderMembershipEvent = Object.values(roomMemberEvents).find(
            (e) => e.state_key === event.sender && e.room_id === event.room_id,
          );
          return {
            roomId: event.room_id,
            userId: event.state_key,
            userDisplayName: senderMembershipEvent?.content.displayname,
          };
        });
      return members;
    },
  );
}
