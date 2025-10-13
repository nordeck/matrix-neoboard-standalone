// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { useTheme } from '@mui/material';
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
  const theme = useTheme();
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
                  <NeoboardApp
                    layoutProps={{
                      height: `calc(100% - ${theme.offsetHeight})`,
                    }}
                  />
                </ConnectionStateProvider>
              </SnackbarProvider>
            </GuidedTourProvider>
          </WhiteboardHotkeysProvider>
        </LayoutStateProvider>
      </FontsLoadedContextProvider>
    </>
  );
};
