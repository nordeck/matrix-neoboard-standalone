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

// init i18 first
import i18n from './i18n';

import log from 'loglevel';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { AppContainer } from './AppContainer';
import './index.css';
import { Application } from './state';
import { createStore, initializeStore } from './store';

if (process.env.NODE_ENV === 'development') {
  log.setDefaultLevel('debug');
}

const application = new Application();
application.start();

const store = createStore({
  standaloneApi: application.standaloneApiPromise,
  widgetApi: application.widgetApiPromise,
});

initializeStore(store);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <AppContainer application={application} store={store} />
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>,
);
