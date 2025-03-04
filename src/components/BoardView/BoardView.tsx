/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
  ConnectionStateDialog,
  ConnectionStateProvider,
  DraggableStyles,
  FontsLoadedContextProvider,
  GuidedTourProvider,
  LayoutStateProvider,
  App as NeoboardApp,
  Snackbar,
  SnackbarProvider,
  WhiteboardHotkeysProvider,
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
  whiteboardApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import loglevel from 'loglevel';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { useSaveOnLeave } from '../LoggedInLayout/useSaveOnLeave.tsx';
import { useOpenedRoomId } from '../RoomIdProvider';
import { SnapshotLoadStateDialog } from '../SnapshotLoadStateDialog/SnapshotLoadStateDialog';
import { useStandaloneWidgetApi } from '../StandaloneWidgetApiProvider';

export const BoardView = () => {
  const dispatch = useAppDispatch();
  const roomId = useOpenedRoomId();
  const whiteboardManager = useWhiteboardManager();
  const standaloneWidgetApi = useStandaloneWidgetApi();

  useEffect(() => {
    // override a widget room id
    standaloneWidgetApi.overrideWidgetParameters({ roomId });

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
  }, [roomId, standaloneWidgetApi, dispatch]);

  const clearWhiteboard = useCallback(() => {
    try {
      whiteboardManager.clear();
    } catch (error) {
      loglevel.error('Error while clearing the whiteboard on leave', error);
    }
  }, [whiteboardManager]);

  const { elements: saveOnLeaveElements, persist } = useSaveOnLeave({
    onConfirmError: clearWhiteboard,
  });

  useEffect(() => {
    const handleClear = async () => {
      const whiteboard = whiteboardManager.getActiveWhiteboardInstance();
      if (whiteboard !== undefined) {
        try {
          await persist(whiteboard);
        } catch (error) {
          console.error('Error persisting whiteboard:', error);
          return;
        }
      }
      clearWhiteboard();
    };

    return () => {
      handleClear();
    };
  }, [whiteboardManager, persist, clearWhiteboard]);

  return (
    <>
      {saveOnLeaveElements}
      <DraggableStyles />
      <FontsLoadedContextProvider>
        <LayoutStateProvider>
          <WhiteboardHotkeysProvider>
            <GuidedTourProvider>
              <SnackbarProvider>
                <Snackbar />
                <ConnectionStateProvider>
                  <ConnectionStateDialog />
                  <SnapshotLoadStateDialog />
                  <NeoboardApp layoutProps={{ height: 'calc(90vh - 25px)' }} />
                </ConnectionStateProvider>
              </SnackbarProvider>
            </GuidedTourProvider>
          </WhiteboardHotkeysProvider>
        </LayoutStateProvider>
      </FontsLoadedContextProvider>
    </>
  );
};
