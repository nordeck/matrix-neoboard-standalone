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

import { useTranslation } from 'react-i18next';
import './App.css';
import { LoggedInView } from './components/LoggedInView';
import { Login } from './components/Login';
import { LoggedInProvider, useApplicationState } from './state';

export const App = () => {
  const { i18n, t } = useTranslation();
  const applicationState = useApplicationState();

  return (
    <>
      <h1>{t('home.greeting', 'Hello')}</h1>
      <div>
        <button onClick={() => i18n.changeLanguage('de')}>DE</button>
        <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      </div>

      {applicationState.lifecycleState === 'starting' && <div>Starting…</div>}
      {applicationState.lifecycleState === 'loggedOut' && <Login />}
      {applicationState.lifecycleState === 'loggedIn' && (
        <LoggedInProvider loggedInState={applicationState.state}>
          <LoggedInView />
        </LoggedInProvider>
      )}
    </>
  );
};
