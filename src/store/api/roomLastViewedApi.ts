/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

import { baseApi as neoboardBaseApi } from '@nordeck/matrix-neoboard-react-sdk';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

/**
 * Timestamp at which the current user last viewed a room, keyed by room id.
 */
export type RoomLastViewed = Record<string, number>;

const emptyRoomLastViewed: RoomLastViewed = {};

export const roomLastViewedApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoomLastViewed: builder.query<RoomLastViewed, void>({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const lastViewed = await standaloneApi.client.getRoomLastViewed(
          Symbols.AnyRoom,
        );

        return { data: lastViewed };
      },
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, extra, updateCachedData },
      ) {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        await cacheDataLoaded;

        const subscription = standaloneApi.client
          .roomLastViewedObservable()
          .pipe(
            bufferTime(100),
            filter((roomIds) => roomIds.length > 0),
          )
          .subscribe(async (roomIds) => {
            const lastViewed = await standaloneApi.client.getRoomLastViewed([
              ...new Set(roomIds),
            ]);

            updateCachedData((state) => {
              for (const [roomId, ts] of Object.entries(lastViewed)) {
                state[roomId] = ts;
              }
            });
          });

        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

export const { useGetAllRoomLastViewedQuery } = roomLastViewedApi;

const getRoomLastViewedSelector =
  roomLastViewedApi.endpoints.getAllRoomLastViewed.select();

export function selectAllRoomLastViewed(rootState: RootState): RoomLastViewed {
  return getRoomLastViewedSelector(rootState).data ?? emptyRoomLastViewed;
}
