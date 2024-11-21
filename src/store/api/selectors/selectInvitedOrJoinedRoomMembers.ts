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
