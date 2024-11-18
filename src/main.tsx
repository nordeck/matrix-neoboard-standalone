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

// init i18 first
import i18n from './i18n';

import { createWhiteboardManager } from '@nordeck/matrix-neoboard-react-sdk';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { AppContainer } from './AppContainer';
import './index.css';
import { Application } from './state';
import { createStore, initializeStore } from './store';

const application = new Application();
application.start();

const store = createStore({
  standaloneApi: application.standaloneApiPromise,
  widgetApi: application.widgetApiPromise,
});

initializeStore(store);

const whiteboardManager = createWhiteboardManager(
  store,
  application.widgetApiPromise,
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AppContainer
            application={application}
            whiteboardManager={whiteboardManager}
          />
        </Provider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>,
);
