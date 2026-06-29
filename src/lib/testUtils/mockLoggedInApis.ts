/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
import { WidgetApi, WidgetParameters } from '@matrix-widget-toolkit/api';
import { LoggedInState } from '../../state';
import {
  StandaloneApi,
  StandaloneApiImpl,
  StandaloneClient,
  StandaloneWidgetApiImpl,
} from '../../toolkit/standalone';

export function mockLoggedInApis({
  userId,
  roomId,
  standaloneClient,
}: {
  userId: string;
  roomId: string;
  standaloneClient: StandaloneClient;
}): {
  standaloneApi: StandaloneApi;
  widgetApi: WidgetApi;
  loggedInState: LoggedInState;
} {
  const deviceId = 'device-1';
  const homeserverUrl = 'https://localhost:8008';

  const standaloneApi = new StandaloneApiImpl(standaloneClient);

  const widgetParameters: WidgetParameters = {
    userId,
    displayName: '',
    avatarUrl: '',
    roomId,
    theme: 'light',
    clientId: 'net.nordeck.matrix_neoboard_standalone',
    clientLanguage: 'en',
    baseUrl: homeserverUrl,
    isOpenedByClient: false,
    deviceId,
  };

  const widgetApi = new StandaloneWidgetApiImpl(
    new StandaloneApiImpl(standaloneClient),
    'widgetId',
    widgetParameters,
  );

  const loggedInState: LoggedInState = {
    userId,
    deviceId,
    homeserverUrl,
    standaloneClient,
    resolveWidgetApi: () => {},
    widgetApiPromise: Promise.resolve(widgetApi),
  };

  return {
    standaloneApi,
    widgetApi,
    loggedInState,
  };
}
