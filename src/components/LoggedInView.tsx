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

import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import {
  DraggableStyles,
  FontsLoadedContextProvider,
  GuidedTourProvider,
  LayoutStateProvider,
  PageLoader,
  Snackbar,
  SnackbarProvider,
  App as WhiteboardApp,
  WhiteboardHotkeysProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { Suspense } from 'react';
import { useLoggedIn } from '../state';
import { LoggedInLayout } from './LoggedInLayout';
import { WhiteboardList } from './WhiteboardList';

export const LoggedInView = () => {
  const { widgetApiPromise } = useLoggedIn();

  return (
    <LoggedInLayout>
      <WhiteboardList />
      <DraggableStyles />
      <Suspense fallback={<PageLoader />}>
        <MuiWidgetApiProvider
          widgetApiPromise={widgetApiPromise}
          widgetRegistration={{
            name: 'NeoBoard',
            // "pad" suffix to get a custom icon
            type: 'net.nordeck.whiteboard:pad',
          }}
        >
          <FontsLoadedContextProvider>
            <LayoutStateProvider>
              <WhiteboardHotkeysProvider>
                <GuidedTourProvider>
                  <SnackbarProvider>
                    <Snackbar />
                    <WhiteboardApp />
                  </SnackbarProvider>
                </GuidedTourProvider>
              </WhiteboardHotkeysProvider>
            </LayoutStateProvider>
          </FontsLoadedContextProvider>
        </MuiWidgetApiProvider>
      </Suspense>
    </LoggedInLayout>
  );
};
