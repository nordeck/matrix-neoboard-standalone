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

import {
  createWhiteboardManager,
  WhiteboardManagerProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { App } from './App';
import { Application } from './state';
import { ApplicationProvider } from './state/useApplication';
import { StoreType } from './store';

export const AppContainer = ({
  application,
  store,
}: {
  application: Application;
  store: StoreType;
}) => {
  const location = useLocation();

  // Determine if RTC should be disabled based on current route
  const shouldDisableRtc = !location.pathname.startsWith('/board/');

  // Create whiteboard manager based on current route
  const whiteboardManager = useMemo(() => {
    return createWhiteboardManager(
      store,
      application.widgetApiPromise,
      shouldDisableRtc,
    );
  }, [store, application.widgetApiPromise, shouldDisableRtc]);

  // Cleanup whiteboard manager when it changes or component unmounts
  useEffect(() => {
    return () => {
      whiteboardManager.clear();
    };
  }, [whiteboardManager]);

  return (
    <ApplicationProvider application={application}>
      <WhiteboardManagerProvider whiteboardManager={whiteboardManager}>
        <App />
      </WhiteboardManagerProvider>
    </ApplicationProvider>
  );
};
