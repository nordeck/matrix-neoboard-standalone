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

import { compareOriginServerTS, StateEvent } from '@matrix-widget-toolkit/api';
import {
  isValidWhiteboardStateEvent,
  baseApi as neoboardBaseApi,
  STATE_EVENT_WHITEBOARD,
  Whiteboard,
} from '@nordeck/matrix-neoboard-react-sdk';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { isEqual, isError } from 'lodash';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const whiteboardsEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<Whiteboard>) => event.state_key,
  sortComparer: compareOriginServerTS,
});

export const whiteboardApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Receive the list of all whiteboards in all the rooms */
    getWhiteboardsAll: builder.query<
      EntityState<StateEvent<Whiteboard>, string>,
      void
    >({
      // do the initial loading
      async queryFn(_, { extra }) {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

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
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

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
    }),
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
