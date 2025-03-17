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
import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import { styled } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { useGetAllRoomNameEventsQuery } from '../../store/api/roomNameApi';
import {
  StandaloneApiImpl,
  StandaloneWidgetApiImpl,
} from '../../toolkit/standalone';
import { Header } from '../Header';
import { useRoomId } from '../RoomIdProvider';
import { StandaloneWidgetApiProvider } from '../StandaloneWidgetApiProvider';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.chrome,
  height: '100vh',
}));

export const LoggedInLayout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const roomId = useRoomId();
  const { i18n } = useTranslation();
  const {
    homeserverUrl,
    resolveWidgetApi,
    standaloneClient,
    userId,
    widgetApiPromise,
  } = useLoggedIn();

  const { data: roomNameState } = useGetAllRoomNameEventsQuery();
  const title =
    roomId === undefined
      ? 'neoboard'
      : (roomNameState?.entities[roomId]?.content.name ?? 'neoboard');

  useEffect(() => {
    /**
     * Sets a room id to a custom no room value.
     * A particular value is not used by dashboard and can be undefined, but
     * is needs to be defined currently to be used together with MuiWidgetApiProvider
     * to leverage it's loading, error handling and other features, otherwise repair screen
     * will be shown.
     */
    const roomId = '!no-room';

    const widgetParameters: WidgetParameters = {
      userId,
      displayName: '',
      avatarUrl: '',
      roomId,
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
  }, [
    homeserverUrl,
    i18n.language,
    resolveWidgetApi,
    standaloneClient,
    userId,
  ]);

  return (
    <Wrapper>
      <Header title={title} roomId={roomId} />
      <div role="main">
        <MuiWidgetApiProvider widgetApiPromise={widgetApiPromise}>
          <StandaloneWidgetApiProvider>{children}</StandaloneWidgetApiProvider>
        </MuiWidgetApiProvider>
      </div>
    </Wrapper>
  );
};
