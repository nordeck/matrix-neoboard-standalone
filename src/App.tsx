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
