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
