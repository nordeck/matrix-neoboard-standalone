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

import { PowerLevelsStateEvent, StateEvent } from '@matrix-widget-toolkit/api';
import { Whiteboard } from '@nordeck/matrix-neoboard-react-sdk';
import { createSelector } from '@reduxjs/toolkit';
import { WhiteboardSessionsEvent } from '../../../model';
import { SortBy } from '../../dashboard/dashboardSlice';
import { RootState } from '../../store';
import { selectAllPowerLevelsEventEntities } from '../PowerLevelsApi';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';
import { selectAllRoomNameEventEntities } from '../roomNameApi';
import { selectAllWhiteboards } from '../whiteboardApi';
import { selectAllWhiteboardSessionsEventEntities } from '../whiteboardSessionsApi';

export type WhiteboardEntry = {
  roomName: string;
  whiteboard: StateEvent<Whiteboard>;
  whiteboardSessions: StateEvent<WhiteboardSessionsEvent> | undefined;
  powerLevels: StateEvent<PowerLevelsStateEvent> | undefined;
};

export function makeSelectWhiteboards(
  userId: string,
  sortBy: SortBy,
): (state: RootState) => WhiteboardEntry[] {
  return createSelector(
    selectAllWhiteboards,
    selectAllRoomNameEventEntities,
    selectAllRoomMemberEventEntities,
    selectAllWhiteboardSessionsEventEntities,
    selectAllPowerLevelsEventEntities,
    (
      whiteboards,
      roomNameEvents,
      roomMemberEvents,
      whiteboardSessionsEvents,
      powerLevelsEvents,
    ): WhiteboardEntry[] => {
      const boards = whiteboards.flatMap((whiteboard) => {
        const roomName = roomNameEvents[whiteboard.room_id]?.content.name;

        let latestOwnWhiteboardSessionsEvent:
          | StateEvent<WhiteboardSessionsEvent>
          | undefined = undefined;

        // Find latest whiteboardSessions for the whiteboard room and the current user
        Object.values(whiteboardSessionsEvents).forEach(
          (whiteboardSessionsEvent) => {
            if (
              whiteboardSessionsEvent.room_id === whiteboard.room_id &&
              whiteboardSessionsEvent.state_key === userId &&
              (latestOwnWhiteboardSessionsEvent === undefined ||
                latestOwnWhiteboardSessionsEvent.origin_server_ts <
                  whiteboardSessionsEvent.origin_server_ts)
            ) {
              latestOwnWhiteboardSessionsEvent = whiteboardSessionsEvent;
            }
          },
        );

        if (
          roomName &&
          // select rooms where user is a member (invited or joined, filters out leave membership)
          Object.values(roomMemberEvents).some(
            (e) =>
              e && e.room_id === whiteboard.room_id && e.state_key === userId,
          )
        ) {
          return [
            {
              roomName,
              whiteboard,
              whiteboardSessions: latestOwnWhiteboardSessionsEvent,
              powerLevels: powerLevelsEvents[whiteboard.room_id],
            },
          ];
        }

        return [];
      });

      boards.sort(createBoardComparator(sortBy));

      return boards;
    },
  );
}

function createBoardComparator(sortBy: SortBy) {
  return (a: WhiteboardEntry, b: WhiteboardEntry) => {
    if (sortBy === 'recently_viewed') {
      const compareA =
        a.whiteboardSessions?.origin_server_ts ??
        // Fall back to create event, if there is no whiteboardSessions event
        a.whiteboard.origin_server_ts;
      const compareB =
        b.whiteboardSessions?.origin_server_ts ??
        // Fall back to create event, if there is no whiteboardSessions event
        b.whiteboard.origin_server_ts;
      return compareB - compareA;
    }

    if (sortBy === 'name_asc') {
      return a.roomName.localeCompare(b.roomName);
    }

    if (sortBy === 'name_desc') {
      return b.roomName.localeCompare(a.roomName);
    }

    if (sortBy === 'created_asc') {
      return a.whiteboard.origin_server_ts - b.whiteboard.origin_server_ts;
    }

    if (sortBy === 'created_desc') {
      return b.whiteboard.origin_server_ts - a.whiteboard.origin_server_ts;
    }

    return 0;
  };
}
