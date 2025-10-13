// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import {
  WhiteboardManager,
  WhiteboardManagerProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { useLayoutEffect } from 'react';
import { App } from './App';
import { getEnvironmentAppearance } from './lib';
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
    const appearance = getEnvironmentAppearance();

    const logo32 = document.createElement('link');
    logo32.setAttribute('rel', 'icon');
    logo32.setAttribute('type', 'image/png');
    logo32.setAttribute('sizes', '32x32');
    logo32.setAttribute('href', `/${appearance}-32.png`);

    const logo16 = document.createElement('link');
    logo16.setAttribute('rel', 'icon');
    logo16.setAttribute('type', 'image/png');
    logo16.setAttribute('sizes', '16x16');
    logo16.setAttribute('href', `/${appearance}-16.png`);

    const appleTouch = document.createElement('link');
    appleTouch.setAttribute('rel', 'apple-touch-icon');
    appleTouch.setAttribute('sizes', '180x180');
    appleTouch.setAttribute('href', `/${appearance}-apple-touch-icon.png`);

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
