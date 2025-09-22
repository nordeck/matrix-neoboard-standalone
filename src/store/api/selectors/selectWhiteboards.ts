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
  PowerLevelsStateEvent,
  StateEvent,
  StateEventCreateContent,
} from '@matrix-widget-toolkit/api';
import { matrixRtcMode, Whiteboard } from '@nordeck/matrix-neoboard-react-sdk';
import { createSelector } from '@reduxjs/toolkit';
import { WhiteboardSessionsEvent } from '../../../model';
import { SortBy } from '../../dashboard/dashboardSlice';
import { RootState } from '../../store';
import { selectAllPowerLevelsEventEntities } from '../PowerLevelsApi';
import { selectAllRoomCreateEventEntities } from '../roomCreateApi.ts';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';
import { selectAllRoomNameEventEntities } from '../roomNameApi';
import { selectAllWhiteboards } from '../whiteboardApi';
import { selectAllWhiteboardSessionsEventEntities } from '../whiteboardSessionsApi';

export type SingleWhiteboard = {
  roomName: string;
  whiteboard: StateEvent<Whiteboard>;
};

export type WhiteboardEntry = {
  roomName: string;
  whiteboard: StateEvent<Whiteboard>;
  whiteboardSessions: StateEvent<WhiteboardSessionsEvent> | undefined;
  powerLevels: StateEvent<PowerLevelsStateEvent> | undefined;
  roomCreateEvent: StateEvent<StateEventCreateContent> | undefined;
  preview: string | undefined;
};

export function makeSelectWhiteboard(
  roomId: string,
): (state: RootState) => SingleWhiteboard | undefined {
  return createSelector(
    selectAllWhiteboards,
    selectAllRoomNameEventEntities,
    (whiteboards, roomNameEvents): SingleWhiteboard | undefined => {
      const whiteboard = whiteboards.find((whiteboard) => {
        return whiteboard.room_id === roomId;
      });

      const roomName = roomNameEvents[roomId]?.content.name;

      if (whiteboard && roomName) {
        return {
          roomName,
          whiteboard,
        };
      }

      return undefined;
    },
  );
}

export function makeSelectWhiteboards(
  userId: string,
  deviceId: string,
  sortBy?: SortBy,
): (state: RootState) => WhiteboardEntry[] {
  return createSelector(
    selectAllWhiteboards,
    selectAllRoomNameEventEntities,
    selectAllRoomMemberEventEntities,
    selectAllWhiteboardSessionsEventEntities,
    selectAllPowerLevelsEventEntities,
    selectAllRoomCreateEventEntities,
    (
      whiteboards,
      roomNameEvents,
      roomMemberEvents,
      whiteboardSessionsEvents,
      powerLevelsEvents,
      roomCreateEvents,
    ): WhiteboardEntry[] => {
      /**
       * Currently, the rule is one whiteboard equals one room.
       * Remembers room IDs to de-duplicate the whiteboard list.
       */
      const seenRooms = new Set<string>();

      const boards: WhiteboardEntry[] = whiteboards.flatMap((whiteboard) => {
        const { room_id } = whiteboard;

        if (seenRooms.has(room_id)) {
          return [];
        }

        seenRooms.add(room_id);

        const roomName = roomNameEvents[room_id]?.content.name;

        let latestOwnWhiteboardSessionsEvent:
          | StateEvent<WhiteboardSessionsEvent>
          | undefined = undefined;

        // Find latest whiteboardSessions for the whiteboard room and the current user
        const stateKey = matrixRtcMode ? `_${userId}_${deviceId}` : userId;
        Object.values(whiteboardSessionsEvents).forEach(
          (whiteboardSessionsEvent) => {
            if (
              whiteboardSessionsEvent.room_id === whiteboard.room_id &&
              whiteboardSessionsEvent.state_key === stateKey &&
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
            (e) => e && e.room_id === room_id && e.state_key === userId,
          )
        ) {
          return [
            {
              roomName,
              whiteboard,
              whiteboardSessions: latestOwnWhiteboardSessionsEvent,
              powerLevels: powerLevelsEvents[room_id],
              roomCreateEvent: roomCreateEvents[room_id],
              preview: undefined,
            },
          ];
        }

        return [];
      });

      if (sortBy) {
        boards.sort(createBoardComparator(sortBy));
      }

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
