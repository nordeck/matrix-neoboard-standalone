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

import { WidgetParameters } from '@matrix-widget-toolkit/api';
import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import {
  DraggableStyles,
  FontsLoadedContextProvider,
  GuidedTourProvider,
  LayoutStateProvider,
  PageLoader,
  Snackbar,
  SnackbarProvider,
  App as WhiteboardApp,
  WhiteboardHotkeysProvider,
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
  whiteboardApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import { isEqual } from 'lodash';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useLoggedIn } from '../state';
import { useAppDispatch, useAppSelector } from '../store';
import { useGetAllRoomNameEventsQuery } from '../store/api/roomNameApi';
import { makeSelectWhiteboards } from '../store/api/selectors/selectWhiteboards';
import {
  StandaloneApiImpl,
  StandaloneWidgetApi,
  StandaloneWidgetApiImpl,
} from '../toolkit/standalone';
import { Dashboard } from './Dashboard';
import { LoggedInLayout } from './LoggedInLayout';

export const LoggedInView = () => {
  const {
    homeserverUrl,
    resolveWidgetApi,
    standaloneClient,
    userId,
    widgetApiPromise,
  } = useLoggedIn();
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const [widgetApi, setWidgetApi] = useState<StandaloneWidgetApi>();
  const dispatch = useAppDispatch();

  const handleLogoClick = useCallback(() => {
    setSelectedRoomId(undefined);
  }, [setSelectedRoomId]);

  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId),
    [userId],
  );
  const whiteboardManager = useWhiteboardManager();

  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  useEffect(() => {
    if (selectedRoomId === undefined) {
      return;
    }

    if (widgetApi === undefined) {
      const widgetParameters: WidgetParameters = {
        userId,
        displayName: '',
        avatarUrl: '',
        roomId: selectedRoomId,
        theme: 'light',
        clientId: 'net.nordeck.matrix_neoboard_standalone',
        clientLanguage: 'EN',
        baseUrl: homeserverUrl,
        isOpenedByClient: false,
      };

      const widgetApi = new StandaloneWidgetApiImpl(
        new StandaloneApiImpl(standaloneClient),
        'widgetId',
        widgetParameters,
      );

      resolveWidgetApi(widgetApi);
      setWidgetApi(widgetApi);
      return;
    }

    const whiteboardEvent = whiteboards.find(
      (w) => w.whiteboard.room_id === selectedRoomId,
    );

    if (whiteboardEvent?.whiteboard === undefined) {
      return;
    }

    widgetApi.overrideWidgetParameters({
      roomId: selectedRoomId,
    });

    // Force refetch room widget related endpoints
    dispatch(
      powerLevelsApi.endpoints.getPowerLevels.initiate(undefined, {
        forceRefetch: true,
      }),
    );
    dispatch(
      roomNameApi.endpoints.getRoomName.initiate(undefined, {
        forceRefetch: true,
      }),
    );
    dispatch(
      whiteboardApi.endpoints.getWhiteboards.initiate(undefined, {
        forceRefetch: true,
      }),
    );
  }, [
    dispatch,
    homeserverUrl,
    resolveWidgetApi,
    selectedRoomId,
    standaloneClient,
    userId,
    whiteboardManager,
    whiteboards,
    widgetApi,
  ]);

  const { data: roomNameState } = useGetAllRoomNameEventsQuery();
  const title =
    selectedRoomId === undefined
      ? 'neoboard'
      : roomNameState?.entities[selectedRoomId]?.content.name ?? 'neoboard';

  return (
    <LoggedInLayout onLogoClick={handleLogoClick} title={title}>
      <DraggableStyles />
      {selectedRoomId === undefined ? (
        <Dashboard setSelectedRoomId={setSelectedRoomId} />
      ) : (
        <Suspense fallback={<PageLoader />}>
          <MuiWidgetApiProvider
            widgetApiPromise={widgetApiPromise}
            widgetRegistration={{
              name: 'NeoBoard',
              // "pad" suffix to get a custom icon
              type: 'net.nordeck.whiteboard:pad',
            }}
          >
            <FontsLoadedContextProvider>
              <LayoutStateProvider>
                <WhiteboardHotkeysProvider>
                  <GuidedTourProvider>
                    <SnackbarProvider>
                      <Snackbar />
                      <WhiteboardApp
                        layoutProps={{ height: 'calc(90vh - 25px)' }}
                      />
                    </SnackbarProvider>
                  </GuidedTourProvider>
                </WhiteboardHotkeysProvider>
              </LayoutStateProvider>
            </FontsLoadedContextProvider>
          </MuiWidgetApiProvider>
        </Suspense>
      )}
    </LoggedInLayout>
  );
};
