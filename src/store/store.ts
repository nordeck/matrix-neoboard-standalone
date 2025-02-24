/*
 * Copyright 2022 Nordeck IT + Consulting GmbH
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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import {
  baseApi,
  connectionInfoReducer,
  shapeSizesReducer,
} from '@nordeck/matrix-neoboard-react-sdk';
import {
  autoBatchEnhancer,
  configureStore,
  Middleware,
} from '@reduxjs/toolkit';
import { StandaloneApi } from '../toolkit/standalone';
import { dashboardReducer } from './dashboard/dashboardSlice';
import { saveDashboardState } from './dashboard/persistence';
import { initializeApi } from './initializeApi';
import { loggerMiddleware } from './loggerMiddleware';

export function initializeStore(store: StoreType): Promise<void> {
  const { dispatch } = store;

  store.subscribe(() => {
    // Persist state on any change.
    // This can be optimised in the future.
    saveDashboardState(store.getState().dashboardReducer);
  });

  return initializeApi(dispatch);
}

export function createStore({
  standaloneApi,
  widgetApi,
}: {
  standaloneApi: StandaloneApi | Promise<StandaloneApi>;
  widgetApi: WidgetApi | Promise<WidgetApi>;
}) {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      dashboardReducer,
      shapeSizesReducer,
      connectionInfoReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // permits the use of a function as a 'validator' in the documentSnapshotApi
          ignoredPaths: ['meta.arg', 'payload.timestamp', /validator$/],
        },
        thunk: {
          extraArgument: {
            standaloneApi,
            widgetApi,
          } as ThunkExtraArgument,
        },
      }).concat(...([loggerMiddleware, baseApi.middleware] as Middleware[])),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(
        autoBatchEnhancer(
          // Disable the auto batching when running tests in HappyDOM, as it
          // conflicts with fake timers.
          navigator.userAgent.includes('HappyDOM')
            ? { type: 'tick' }
            : undefined,
        ),
      ),
  });
  return store;
}

export type StoreType = ReturnType<typeof createStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];

/**
 * Extra arguments that are provided to `createAsyncThunk`
 */
export type ThunkExtraArgument = {
  standaloneApi: StandaloneApi | Promise<StandaloneApi>;
  widgetApi: WidgetApi | Promise<WidgetApi>;
};
