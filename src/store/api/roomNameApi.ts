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

import { StateEvent } from '@matrix-widget-toolkit/api';
import {
  isValidRoomNameEvent,
  RoomNameEvent,
  STATE_EVENT_ROOM_NAME,
  baseApi as whiteboardBaseApi,
} from '@nordeck/matrix-neoboard-widget';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const roomNameEventEntityAdapter = createEntityAdapter<
  StateEvent<RoomNameEvent>
>({
  selectId: (event) => event.room_id,
});

export const roomNameApi = whiteboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomNameEvents: builder.query<
      EntityState<StateEvent<RoomNameEvent>>,
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

const getRoomNameEventsSelectors =
  roomNameApi.endpoints.getRoomNameEvents.select();
export const { selectEntities: selectRoomNameEventEntities } =
  roomNameEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getRoomNameEventsSelectors(rootState).data ??
      roomNameEventEntityAdapter.getInitialState()
    );
  });
