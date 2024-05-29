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
