// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
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
