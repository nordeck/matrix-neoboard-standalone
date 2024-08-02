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
  PowerLevelsStateEvent,
  STATE_EVENT_POWER_LEVELS,
  StateEvent,
  isValidPowerLevelStateEvent,
} from '@matrix-widget-toolkit/api';
import { baseApi as neoboardBaseApi } from '@nordeck/matrix-neoboard-react-sdk';
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { Symbols } from 'matrix-widget-api';
import { bufferTime, filter } from 'rxjs';
import { RootState, ThunkExtraArgument } from '../store';

const powerLevelsEventEntityAdapter = createEntityAdapter({
  selectId: (event: StateEvent<PowerLevelsStateEvent>) => event.room_id,
});

export const powerLevelsApi = neoboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPowerLevelsEvents: builder.query<
      EntityState<StateEvent<PowerLevelsStateEvent>, string>,
      void
    >({
      queryFn: async (_, { extra }) => {
        const standaloneApi = await (extra as ThunkExtraArgument).standaloneApi;

        const events = await standaloneApi.client.receiveStateEvents(
          STATE_EVENT_POWER_LEVELS,
          { roomIds: Symbols.AnyRoom },
        );

        return {
          data: powerLevelsEventEntityAdapter.upsertMany(
            powerLevelsEventEntityAdapter.getInitialState(),
            events.filter(isValidPowerLevelStateEvent),
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
          .observeStateEvents(STATE_EVENT_POWER_LEVELS, {
            roomIds: Symbols.AnyRoom,
          })
          .pipe(
            filter(isValidPowerLevelStateEvent),
            bufferTime(100),
            filter((list) => list.length > 0),
          )
          .subscribe((events) => {
            updateCachedData((state) => {
              powerLevelsEventEntityAdapter.upsertMany(state, events);
            });
          });

        // wait until subscription is cancelled
        await cacheEntryRemoved;

        subscription.unsubscribe();
      },
    }),
  }),
});

export const { useGetAllPowerLevelsEventsQuery } = powerLevelsApi;

const getPowerLevelsEventsSelectors =
  powerLevelsApi.endpoints.getAllPowerLevelsEvents.select();
export const { selectEntities: selectAllPowerLevelsEventEntities } =
  powerLevelsEventEntityAdapter.getSelectors((rootState: RootState) => {
    return (
      getPowerLevelsEventsSelectors(rootState).data ??
      powerLevelsEventEntityAdapter.getInitialState()
    );
  });
