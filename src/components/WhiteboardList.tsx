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
import { List, ListItemButton, ListItemText } from '@mui/material';
import {
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
} from '@nordeck/matrix-neoboard-widget';
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
