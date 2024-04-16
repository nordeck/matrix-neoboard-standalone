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

import { compareOriginServerTS, StateEvent } from '@matrix-widget-toolkit/api';
import {
  isValidWhiteboardStateEvent,
  STATE_EVENT_WHITEBOARD,
  Whiteboard,
  baseApi as whiteboardBaseApi,
} from '@nordeck/matrix-neoboard-widget';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { isEqual, isError } from 'lodash';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const whiteboardsEntityAdapter = createEntityAdapter<StateEvent<Whiteboard>>({
  selectId: (event) => event.state_key,
  sortComparer: compareOriginServerTS,
});

export const whiteboardApi = whiteboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Receive the list of all whiteboards in all the rooms */
    getWhiteboardsAll: builder.query<EntityState<StateEvent<Whiteboard>>, void>(
      {
        // do the initial loading
        async queryFn(_, { extra }) {
          const standaloneApi = await (extra as ThunkExtraArgument)
            .standaloneApi;

          try {
            const initialState = whiteboardsEntityAdapter.getInitialState();
            const events = await standaloneApi.client.receiveStateEvents(
              STATE_EVENT_WHITEBOARD,
              {
                roomIds: Symbols.AnyRoom,
              },
            );

            return {
              data: whiteboardsEntityAdapter.addMany(
                initialState,
                events.filter(isValidWhiteboardStateEvent),
              ),
            };
          } catch (e) {
            return {
              error: {
                name: 'LoadFailed',
                message: `Could not load whiteboards: ${
                  isError(e) ? e.message : JSON.stringify(e)
                }`,
              },
            };
          }
        },

        // observe the room and apply updates to the redux store.
        // see also https://redux-toolkit.js.org/rtk-query/usage/streaming-updates#using-the-oncacheentryadded-lifecycle
        async onCacheEntryAdded(
          _,
          { cacheDataLoaded, cacheEntryRemoved, extra, updateCachedData },
        ) {
          const standaloneApi = await (extra as ThunkExtraArgument)
            .standaloneApi;

          // wait until first data is cached
          await cacheDataLoaded;

          const subscription = standaloneApi
            .observeStateEvents(STATE_EVENT_WHITEBOARD, {
              roomIds: Symbols.AnyRoom,
            })
            .pipe(
              bufferTime(0),
              filter((list) => list.length > 0),
            )
            .subscribe((events) => {
              // update the cached data if the event changes in the room
              const eventsToUpdate = events.filter(isValidWhiteboardStateEvent);
              const eventIdsToDelete = events
                .filter(
                  (e) =>
                    e.type === STATE_EVENT_WHITEBOARD && isEqual(e.content, {}),
                )
                .map((e) => e.state_key);

              updateCachedData((state) => {
                whiteboardsEntityAdapter.upsertMany(state, eventsToUpdate);
                whiteboardsEntityAdapter.removeMany(state, eventIdsToDelete);
              });
            });

          // wait until subscription is cancelled
          await cacheEntryRemoved;

          subscription.unsubscribe();
        },
      },
    ),
  }),
});

const getWhiteboardsAllSelectors =
  whiteboardApi.endpoints.getWhiteboardsAll.select();
export const { selectAll: selectAllWhiteboards } =
  whiteboardsEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getWhiteboardsAllSelectors(rootState).data ??
      whiteboardsEntityAdapter.getInitialState()
    );
  });
