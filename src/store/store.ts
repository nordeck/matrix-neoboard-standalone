/*
 * Copyright 2022 Nordeck IT + Consulting GmbH
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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import { baseApi } from '@nordeck/matrix-neoboard-react-sdk';
import { autoBatchEnhancer, configureStore } from '@reduxjs/toolkit';
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
      }).concat(loggerMiddleware, baseApi.middleware),
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
