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
} from '@nordeck/matrix-neoboard-widget';
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
