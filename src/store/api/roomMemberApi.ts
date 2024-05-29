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
  RoomMemberStateEventContent,
  STATE_EVENT_ROOM_MEMBER,
  StateEvent,
  isValidRoomMemberStateEvent,
} from '@matrix-widget-toolkit/api';
import { baseApi as neoboardBaseApi } from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const roomMemberEventEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<RoomMemberStateEventContent>): string =>
    `${event.room_id}_${event.state_key}`,
});

export const roomMemberApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomMembersAll: builder.query<
      EntityState<StateEvent<RoomMemberStateEventContent>, string>,
      void
    >({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const events = await standaloneApi.client.receiveStateEvents(
          STATE_EVENT_ROOM_MEMBER,
          { roomIds: Symbols.AnyRoom },
        );

        return {
          data: roomMemberEventEntityAdapter.upsertMany(
            roomMemberEventEntityAdapter.getInitialState(),
            events
              .filter(isValidRoomMemberStateEvent)
              .filter((event) =>
                ['join', 'invite'].includes(event.content.membership),
              ),
          ),
        };
      },
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, extra, updateCachedData },
      ) {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        // wait until first data is cached
        await cacheDataLoaded;

        const subscription = standaloneApi
          .observeStateEvents(STATE_EVENT_ROOM_MEMBER, {
            roomIds: Symbols.AnyRoom,
          })
          .pipe(
            filter(isValidRoomMemberStateEvent),
            bufferTime(100),
            filter((list) => list.length > 0),
          )
          .subscribe((events) => {
            updateCachedData((state) => {
              // the user is a proper member
              const toAdd = events.filter((event) =>
                ['join', 'invite'].includes(event.content.membership),
              );

              // the user left the room or was banned.
              const toRemove = events
                .filter(
                  (event) =>
                    !['join', 'invite'].includes(event.content.membership),
                )
                .map(roomMemberEventEntityAdapter.selectId);

              roomMemberEventEntityAdapter.upsertMany(state, toAdd);
              roomMemberEventEntityAdapter.removeMany(state, toRemove);
            });
          });

        // wait until subscription is cancelled
        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

const getRoomMembersSelectors =
  roomMemberApi.endpoints.getRoomMembersAll.select();
export const { selectEntities: selectAllRoomMemberEventEntities } =
  roomMemberEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getRoomMembersSelectors(rootState).data ??
      roomMemberEventEntityAdapter.getInitialState()
    );
  });
