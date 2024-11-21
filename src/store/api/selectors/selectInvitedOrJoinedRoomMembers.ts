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

import { createSelector } from '@reduxjs/toolkit';
import { IUser } from '../../../toolkit/standalone/client/types';
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';

export function makeSelectInvitedOrJoinedRoomMembers(
  roomId: string,
): (state: RootState) => IUser[] {
  return createSelector(
    selectAllRoomMemberEventEntities,
    (roomMemberEvents): IUser[] => {
      const members: IUser[] = Object.values(roomMemberEvents)
        .filter(
          (event) =>
            ['invite', 'join'].includes(event.content.membership) &&
            event.room_id === roomId,
        )
        .map((event) => {
          return {
            user_id: event.state_key,
            display_name: event.content.displayname ?? undefined,
            avatar_url: event.content.avatar_url ?? undefined,
          };
        });
      return members;
    },
  );
}
