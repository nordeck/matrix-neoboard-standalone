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

import { StateEvent } from '@matrix-widget-toolkit/api';
import { Whiteboard } from '@nordeck/matrix-neoboard-react-sdk';
import { createSelector } from '@reduxjs/toolkit';
import { WhiteboardSessionsEvent } from '../../../model';
import { SortBy } from '../../dashboard/dashboardSlice';
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';
import { selectAllRoomNameEventEntities } from '../roomNameApi';
import { selectAllWhiteboards } from '../whiteboardApi';
import { selectAllWhiteboardSessionsEventEntities } from '../whiteboardSessionsApi';

export type WhiteboardEntry = {
  roomName: string;
  whiteboard: StateEvent<Whiteboard>;
  whiteboardSessions: StateEvent<WhiteboardSessionsEvent> | undefined;
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
    (
      whiteboards,
      roomNameEvents,
      roomMemberEvents,
      whiteboardSessionsEvents,
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
