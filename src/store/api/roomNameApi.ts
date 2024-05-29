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
import {
  RoomNameEvent,
  STATE_EVENT_ROOM_NAME,
  isValidRoomNameEvent,
  baseApi as neoboardBaseApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const roomNameEventEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<RoomNameEvent>) => event.room_id,
});

export const roomNameApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoomNameEvents: builder.query<
      EntityState<StateEvent<RoomNameEvent>, string>,
      void
    >({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const events = await standaloneApi.client.receiveStateEvents(
          STATE_EVENT_ROOM_NAME,
          { roomIds: Symbols.AnyRoom },
        );

        return {
          data: roomNameEventEntityAdapter.upsertMany(
            roomNameEventEntityAdapter.getInitialState(),
            events.filter(isValidRoomNameEvent),
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
          .observeStateEvents(STATE_EVENT_ROOM_NAME, {
            roomIds: Symbols.AnyRoom,
          })
          .pipe(
            filter(isValidRoomNameEvent),
            bufferTime(100),
            filter((list) => list.length > 0),
          )
          .subscribe((events) => {
            updateCachedData((state) => {
              roomNameEventEntityAdapter.upsertMany(state, events);
            });
          });

        // wait until subscription is cancelled
        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

export const { useGetAllRoomNameEventsQuery } = roomNameApi;

const getRoomNameEventsSelectors =
  roomNameApi.endpoints.getAllRoomNameEvents.select();
export const { selectEntities: selectAllRoomNameEventEntities } =
  roomNameEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getRoomNameEventsSelectors(rootState).data ??
      roomNameEventEntityAdapter.getInitialState()
    );
  });
