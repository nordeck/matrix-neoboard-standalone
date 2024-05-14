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
import { RootState } from '../../store';
import { selectAllRoomMemberEventEntities } from '../roomMemberApi';
import { selectAllRoomNameEventEntities } from '../roomNameApi';
import { selectAllWhiteboards } from '../whiteboardApi';

export type WhiteboardEntry = {
  roomName: string;
  whiteboard: StateEvent<Whiteboard>;
};

export function makeSelectWhiteboards(
  userId: string,
): (state: RootState) => WhiteboardEntry[] {
  return createSelector(
    selectAllWhiteboards,
    selectAllRoomNameEventEntities,
    selectAllRoomMemberEventEntities,
    (whiteboards, roomNameEvents, roomMemberEvents): WhiteboardEntry[] => {
      return whiteboards.flatMap((whiteboard) => {
        const roomName = roomNameEvents[whiteboard.room_id]?.content.name;

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
            },
          ];
        }

        return [];
      });
    },
  );
}
