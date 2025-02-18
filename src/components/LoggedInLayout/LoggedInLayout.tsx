/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { styled } from '@mui/material';
import {
  DraggableStyles,
  powerLevelsApi,
  roomNameApi,
  useWhiteboardManager,
  whiteboardApi,
} from '@nordeck/matrix-neoboard-react-sdk';
import loglevel from 'loglevel';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useLoggedIn } from '../../state';
import { useSelectedRoom } from '../../state/useSelectedRoom';
import { useAppDispatch } from '../../store';
import { useGetAllRoomNameEventsQuery } from '../../store/api/roomNameApi';
import {
  StandaloneApiImpl,
  StandaloneWidgetApi,
  StandaloneWidgetApiImpl,
} from '../../toolkit/standalone';
import { Header } from '../Header';
import { useSaveOnLeave } from './useSaveOnLeave';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.chrome,
  height: '100vh',
  paddingLeft: '25px',
  paddingRight: '25px',
  paddingBottom: '25px',
}));

const ContentWrapper = styled('div')(() => ({
  borderRadius: '8px',
}));

export const LoggedInLayout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { selectedRoomId } = useSelectedRoom();
  const { i18n } = useTranslation();
  const { homeserverUrl, resolveWidgetApi, standaloneClient, userId } =
    useLoggedIn();
  const [widgetApi, setWidgetApi] = useState<StandaloneWidgetApi>();
  const whiteboardManager = useWhiteboardManager();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    const handleDashboardNavigation = async () => {
      if (location.pathname === '/dashboard') {
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
      }
    };

    handleDashboardNavigation();
  }, [location.pathname, whiteboardManager, persist, clearWhiteboard]);

  const { data: roomNameState } = useGetAllRoomNameEventsQuery();
  const title =
    selectedRoomId === undefined
      ? 'neoboard'
      : (roomNameState?.entities[selectedRoomId]?.content.name ?? 'neoboard');

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
    navigate,
    homeserverUrl,
    i18n.language,
    resolveWidgetApi,
    selectedRoomId,
    standaloneClient,
    userId,
    widgetApi,
  ]);

  return (
    <Wrapper>
      <Header title={title} selectedRoomId={selectedRoomId} />
      <ContentWrapper role="main">
        {saveOnLeaveElements}
        <DraggableStyles />
        {children}
      </ContentWrapper>
    </Wrapper>
  );
};
