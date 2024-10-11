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

import { WidgetParameters } from '@matrix-widget-toolkit/api';
import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import {
  DraggableStyles,
  FontsLoadedContextProvider,
  GuidedTourProvider,
  LayoutStateProvider,
  App as NeoboardApp,
  PageLoader,
  Snackbar,
  SnackbarProvider,
  WhiteboardHotkeysProvider,
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
  whiteboardApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import { isEqual } from 'lodash';
import loglevel from 'loglevel';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { selectSortBy, useAppDispatch, useAppSelector } from '../../store';
import { useGetAllRoomNameEventsQuery } from '../../store/api/roomNameApi';
import { makeSelectWhiteboards } from '../../store/api/selectors/selectWhiteboards';
import {
  StandaloneApiImpl,
  StandaloneWidgetApi,
  StandaloneWidgetApiImpl,
} from '../../toolkit/standalone';
import { Dashboard } from '../Dashboard';
import { LoggedInLayout } from '../LoggedInLayout';
import { useSaveOnLeave } from './useSaveOnLeave';

export const LoggedInView = () => {
  const { i18n } = useTranslation();
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
  const whiteboardManager = useWhiteboardManager();
  /** Whether logo click is currently being handled */
  const handlingLogoClick = useRef(false);

  const clearWhiteboard = useCallback(() => {
    try {
      // Clear the whiteboard, so that everything is properly cleaned up.
      // For example stop event listeners, persistence...
      whiteboardManager.clear();
    } catch (error) {
      // Only log the error and do not block the user from leaving the whiteboard.
      // There may still be some leftovers around, but the user should be able to move on.
      loglevel.error('Error while clearing the whiteboard on leave', error);
    }
    setSelectedRoomId(undefined);
  }, [setSelectedRoomId, whiteboardManager]);

  const { elements: saveOnLeaveElements, persist } = useSaveOnLeave({
    onConfirmError: clearWhiteboard,
  });

  const handleLogoClick = useCallback(async () => {
    if (handlingLogoClick.current) {
      // Logo click already being handled, do nothing
      return;
    }

    handlingLogoClick.current = true;

    const whiteboard = whiteboardManager.getActiveWhiteboardInstance();

    if (whiteboard !== undefined) {
      try {
        await persist(whiteboard);
      } catch {
        return;
      }
    }

    clearWhiteboard();
    handlingLogoClick.current = false;
  }, [clearWhiteboard, persist, whiteboardManager]);

  const sortBy = useAppSelector((state) => selectSortBy(state));
  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId, sortBy),
    [sortBy, userId],
  );

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
        clientLanguage: i18n.language,
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
    i18n.language,
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
      : (roomNameState?.entities[selectedRoomId]?.content.name ?? 'neoboard');

  return (
    <LoggedInLayout onLogoClick={handleLogoClick} title={title}>
      {saveOnLeaveElements}
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
                      <NeoboardApp
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
