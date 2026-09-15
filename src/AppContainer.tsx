/*
 * Copyright 2024-2026 Nordeck IT + Consulting GmbH
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

function setIconLink(
  rel: string,
  sizes: string,
  href: string,
  type?: string,
): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"][sizes="${sizes}"]`,
  );

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('sizes', sizes);
    document.head.appendChild(link);
  }

  if (type) {
    link.setAttribute('type', type);
  }

  link.setAttribute('href', href);
}

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

    setIconLink(
      'icon',
      '32x32',
      getEnvironment('REACT_APP_FAVICON_32', `/${appearance}-32.png`),
      'image/png',
    );
    setIconLink(
      'icon',
      '16x16',
      getEnvironment('REACT_APP_FAVICON_16', `/${appearance}-16.png`),
      'image/png',
    );
    setIconLink(
      'apple-touch-icon',
      '180x180',
      getEnvironment(
        'REACT_APP_APPLE_TOUCH_ICON',
        `/${appearance}-apple-touch-icon.png`,
      ),
    );
  }, []);

  return (
    <ApplicationProvider application={application}>
      <WhiteboardManagerProvider whiteboardManager={whiteboardManager}>
        <App />
      </WhiteboardManagerProvider>
    </ApplicationProvider>
  );
};
