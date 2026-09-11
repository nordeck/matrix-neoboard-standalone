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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import {
  WhiteboardManager,
  WhiteboardManagerProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { useLayoutEffect } from 'react';
import { App } from './App';
import { getDocumentTitle, getEnvironmentAppearance } from './lib';
import { Application } from './state';
import { ApplicationProvider } from './state/useApplication';

export const AppContainer = ({
  application,
  whiteboardManager,
}: {
  application: Application;
  whiteboardManager: WhiteboardManager;
}) => {
  useLayoutEffect(() => {
    document.title = getDocumentTitle();

    const appearance = getEnvironmentAppearance();
    const favicon16 = getEnvironment(
      'REACT_APP_FAVICON_16',
      `/${appearance}-16.png`,
    );
    const favicon32 = getEnvironment(
      'REACT_APP_FAVICON_32',
      `/${appearance}-32.png`,
    );
    const appleTouchIcon = getEnvironment(
      'REACT_APP_APPLE_TOUCH_ICON',
      `/${appearance}-apple-touch-icon.png`,
    );

    const logo32 = document.createElement('link');
    logo32.setAttribute('rel', 'icon');
    logo32.setAttribute('type', 'image/png');
    logo32.setAttribute('sizes', '32x32');
    logo32.setAttribute('href', favicon32);

    const logo16 = document.createElement('link');
    logo16.setAttribute('rel', 'icon');
    logo16.setAttribute('type', 'image/png');
    logo16.setAttribute('sizes', '16x16');
    logo16.setAttribute('href', favicon16);

    const appleTouch = document.createElement('link');
    appleTouch.setAttribute('rel', 'apple-touch-icon');
    appleTouch.setAttribute('sizes', '180x180');
    appleTouch.setAttribute('href', appleTouchIcon);

    document.head.appendChild(logo32);
    document.head.appendChild(logo16);
    document.head.appendChild(appleTouch);
  }, []);

  return (
    <ApplicationProvider application={application}>
      <WhiteboardManagerProvider whiteboardManager={whiteboardManager}>
        <App />
      </WhiteboardManagerProvider>
    </ApplicationProvider>
  );
};
