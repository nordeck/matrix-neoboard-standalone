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
  STATE_EVENT_WHITEBOARD_SESSIONS,
  baseApi as neoboardBaseApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import {
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
          STATE_EVENT_WHITEBOARD_SESSIONS,
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
          .observeStateEvents(STATE_EVENT_WHITEBOARD_SESSIONS, {
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
