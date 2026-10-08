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
  MembershipState,
  RoomMemberStateEventContent,
  StateEvent,
} from '@matrix-widget-toolkit/api';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';

export function makeSelectMembership(
  userId: string,
  roomId: string,
  membership: MembershipState,
): (state: RootState) => StateEvent<RoomMemberStateEventContent> | undefined {
  return createSelector(
    selectAllRoomMemberEventEntities,
    (roomMemberEvents): StateEvent<RoomMemberStateEventContent> | undefined => {
      return Object.values(roomMemberEvents).find(
        (event) =>
          event.state_key === userId &&
          event.room_id === roomId &&
          event.content.membership === membership,
      );
    },
  );
}
