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

import { MuiWidgetApiProvider } from '@matrix-widget-toolkit/mui';
import {
  ConnectionStateDialog,
  ConnectionStateProvider,
  FontsLoadedContextProvider,
  GuidedTourProvider,
  LayoutStateProvider,
  App as NeoboardApp,
  PageLoader,
  Snackbar,
  SnackbarProvider,
  WhiteboardHotkeysProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { Suspense } from 'react';
import { useLoggedIn } from '../../state';
import { SnapshotLoadStateDialog } from '../SnapshotLoadStateDialog/SnapshotLoadStateDialog';

export const BoardView = () => {
  const { widgetApiPromise } = useLoggedIn();

  return (
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
                  <ConnectionStateProvider>
                    <ConnectionStateDialog />
                    <SnapshotLoadStateDialog />
                    <NeoboardApp
                      layoutProps={{ height: 'calc(90vh - 25px)' }}
                    />
                  </ConnectionStateProvider>
                </SnackbarProvider>
              </GuidedTourProvider>
            </WhiteboardHotkeysProvider>
          </LayoutStateProvider>
        </FontsLoadedContextProvider>
      </MuiWidgetApiProvider>
    </Suspense>
  );
};
