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

import { createWhiteboardManager } from '@nordeck/matrix-neoboard-react-sdk';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from './AppContainer';
import './i18n';
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

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <Provider store={store}>
        <AppContainer
          application={application}
          whiteboardManager={whiteboardManager}
        />
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')!,
);
