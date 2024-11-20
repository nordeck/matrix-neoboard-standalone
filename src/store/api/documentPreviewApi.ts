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
  DocumentPreviewEvent,
  STATE_EVENT_DOCUMENT_PREVIEW,
  isValidDocumentPreviewEvent,
  baseApi as neoboardBaseApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const documentPreviewEventEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<DocumentPreviewEvent>) => event.room_id,
});

export const documentPreviewApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDocumentPreviewEvents: builder.query<
      EntityState<StateEvent<DocumentPreviewEvent>, string>,
      void
    >({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const events = await standaloneApi.client.receiveStateEvents(
          STATE_EVENT_DOCUMENT_PREVIEW,
          { roomIds: Symbols.AnyRoom },
        );

        return {
          data: documentPreviewEventEntityAdapter.upsertMany(
            documentPreviewEventEntityAdapter.getInitialState(),
            events.filter(isValidDocumentPreviewEvent),
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
          .observeStateEvents(STATE_EVENT_DOCUMENT_PREVIEW, {
            roomIds: Symbols.AnyRoom,
          })
          .pipe(
            filter(isValidDocumentPreviewEvent),
            bufferTime(100),
            filter((list) => list.length > 0),
          )
          .subscribe((events) => {
            updateCachedData((state) => {
              documentPreviewEventEntityAdapter.upsertMany(state, events);
            });
          });

        // wait until subscription is cancelled
        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

export const { useGetAllDocumentPreviewEventsQuery } = documentPreviewApi;

const getDocumentPreviewEventsSelectors =
  documentPreviewApi.endpoints.getAllDocumentPreviewEvents.select();
export const { selectEntities: selectAllDocumentPreviewEventEntities } =
  documentPreviewEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getDocumentPreviewEventsSelectors(rootState).data ??
      documentPreviewEventEntityAdapter.getInitialState()
    );
  });
