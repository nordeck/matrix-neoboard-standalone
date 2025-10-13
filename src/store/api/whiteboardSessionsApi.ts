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
import { baseApi as neoboardBaseApi } from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import {
  STATE_EVENT_SESSION,
  WhiteboardSessionsEvent,
  isValidWhiteboardSessionsEvent,
} from '../../model';
import { RootState, ThunkExtraArgument } from '../store';

const whiteboardSessionsEventEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<WhiteboardSessionsEvent>) => event.event_id,
});

export const whiteboardSessionsApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWhiteboardSessionsEvents: builder.query<
      EntityState<StateEvent<WhiteboardSessionsEvent>, string>,
      void
    >({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const events = await standaloneApi.client.receiveStateEvents(
          STATE_EVENT_SESSION,
          { roomIds: Symbols.AnyRoom },
        );

        return {
          data: whiteboardSessionsEventEntityAdapter.upsertMany(
            whiteboardSessionsEventEntityAdapter.getInitialState(),
            events.filter(isValidWhiteboardSessionsEvent),
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
          .observeStateEvents(STATE_EVENT_SESSION, {
            roomIds: Symbols.AnyRoom,
          })
          .pipe(
            filter(isValidWhiteboardSessionsEvent),
            bufferTime(100),
            filter((list) => list.length > 0),
          )
          .subscribe((events) => {
            updateCachedData((state) => {
              whiteboardSessionsEventEntityAdapter.upsertMany(state, events);
            });
          });

        // wait until subscription is cancelled
        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

export const { useGetAllWhiteboardSessionsEventsQuery } = whiteboardSessionsApi;

const getWhiteboardSessionsEventsSelectors =
  whiteboardSessionsApi.endpoints.getAllWhiteboardSessionsEvents.select();
export const { selectEntities: selectAllWhiteboardSessionsEventEntities } =
  whiteboardSessionsEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getWhiteboardSessionsEventsSelectors(rootState).data ??
      whiteboardSessionsEventEntityAdapter.getInitialState()
    );
  });
