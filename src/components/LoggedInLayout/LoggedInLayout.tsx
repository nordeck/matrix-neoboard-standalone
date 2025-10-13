// SPDX-License-Identifier: AGPL-3.0-or-later

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
import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material';
import React, { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEnvironmentAppearance } from '../../lib';
import { useLoggedIn } from '../../state';
import { useGetAllRoomNameEventsQuery } from '../../store/api/roomNameApi';
import {
  StandaloneApiImpl,
  StandaloneWidgetApiImpl,
} from '../../toolkit/standalone';
import { Header, HeaderMenu, HeaderTitle } from '../Header';
import { NeoBoardIcon } from '../Header/NeoBoardIcon.tsx';
import { useRoomId } from '../RoomIdProvider';
import { StandaloneWidgetApiProvider } from '../StandaloneWidgetApiProvider';
import { NavbarBanner } from './NavbarBanner.tsx';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.loggedIn,
  height: '100vh',
}));

export const LoggedInLayout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const {
    homeserverUrl,
    resolveWidgetApi,
    standaloneClient,
    userId,
    deviceId,
    widgetApiPromise,
  } = useLoggedIn();

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
      deviceId,
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
    deviceId,
  ]);

  return (
    <Wrapper>
      <BannerWrapper>
        <div role="main">
          <MuiWidgetApiProvider widgetApiPromise={widgetApiPromise}>
            <StandaloneWidgetApiProvider>
              {children}
            </StandaloneWidgetApiProvider>
          </MuiWidgetApiProvider>
        </div>
      </BannerWrapper>
    </Wrapper>
  );
};

type BannerWrapperProps = PropsWithChildren<{}>;

function BannerWrapper({ children }: BannerWrapperProps) {
  const appearance = getEnvironmentAppearance();

  const roomId = useRoomId();

  const { data: roomNameState } = useGetAllRoomNameEventsQuery();
  const title =
    roomId === undefined
      ? appearance === 'neoboard'
        ? 'neoboard'
        : ''
      : (roomNameState?.entities[roomId]?.content.name ?? 'neoboard');

  let Banner: React.FC<PropsWithChildren<{}>>;
  if (appearance === 'neoboard') {
    Banner = Header;
  } else if (appearance === 'opendesk') {
    Banner = NavbarBanner;
  } else {
    throw new Error(`unexpected appearance: ${appearance}`);
  }

  return (
    <>
      <Banner>
        <HeaderTitle
          title={title}
          roomId={roomId}
          homeIcon={appearance === 'neoboard' ? <NeoBoardIcon /> : <HomeIcon />}
          hasPadding={appearance !== 'neoboard'}
        />
        <HeaderMenu roomId={roomId} />
      </Banner>
      {children}
    </>
  );
}
