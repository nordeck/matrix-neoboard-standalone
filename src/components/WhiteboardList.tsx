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
import { List, ListItemButton, ListItemText } from '@mui/material';
import {
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
} from '@nordeck/matrix-neoboard-react-sdk';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useLoggedIn } from '../state';
import { useAppDispatch, useAppSelector } from '../store';
import { makeSelectWhiteboards } from '../store/api/selectors/selectWhiteboards';
import {
  StandaloneApiImpl,
  StandaloneWidgetApi,
  StandaloneWidgetApiImpl,
} from '../toolkit/standalone';

export const WhiteboardList = () => {
  const whiteboardManager = useWhiteboardManager();
  const { userId, homeserverUrl, standaloneClient, resolveWidgetApi } =
    useLoggedIn();

  const [widgetApi, setWidgetApi] = useState<StandaloneWidgetApi>();
  const [selectedRoomId, setSelectedRoomId] = useState<string>();

  const selectWhiteboards = useMemo(makeSelectWhiteboards, []);

  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      whiteboards &&
      whiteboards.length > 0 &&
      selectedRoomId === undefined &&
      widgetApi === undefined
    ) {
      const roomId = whiteboards[0].whiteboard.room_id;

      const widgetParameters: WidgetParameters = {
        userId,
        displayName: '',
        avatarUrl: '',
        roomId,
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
      setSelectedRoomId(roomId);
    }
  }, [
    whiteboards,
    selectedRoomId,
    widgetApi,
    userId,
    homeserverUrl,
    standaloneClient,
    resolveWidgetApi,
  ]);

  return (
    <List sx={{ backgroundColor: '#ffffff' }}>
      {whiteboards.map(({ roomName, whiteboard }, idx) => (
        <ListItemButton
          key={idx}
          onClick={() => {
            const roomId = whiteboard.room_id;
            setSelectedRoomId(roomId);
            if (widgetApi) {
              widgetApi.overrideWidgetParameters({
                roomId,
              });
              whiteboardManager.selectActiveWhiteboardInstance(
                whiteboard,
                userId,
              );

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
            }
          }}
        >
          <ListItemText primary={roomName} />
        </ListItemButton>
      ))}
    </List>
  );
};
