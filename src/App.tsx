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

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';
import './App.css';
import { BoardViewWrapper } from './components/BoardView';
import { Dashboard } from './components/Dashboard';
import { LoggedInLayout } from './components/LoggedInLayout';
import { StandaloneThemeProvider } from './components/StandaloneThemeProvider';
import { StartingView } from './components/StartingView';
import { WelcomePane } from './components/Welcome/WelcomePane';
import { LoggedInProvider, useApplicationState } from './state';
import { SelectedRoomProvider } from './state/useSelectedRoom';

export const App = () => {
  const { lifecycleState } = useApplicationState();

  return (
    <StandaloneThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes for Logged In Users */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:roomId" element={<BoardViewWrapper />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
          {lifecycleState === 'loggedOut' && (
            <>
              <Route path="/login" element={<WelcomePane />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </StandaloneThemeProvider>
  );
};

function ProtectedRoutes() {
  const applicationState = useApplicationState();
  const { lifecycleState } = applicationState;

  if (lifecycleState === 'starting') {
    return <StartingView />;
  }

  if (lifecycleState !== 'loggedIn') {
    return <Navigate to="/login" replace />;
  }

  return (
    <LoggedInProvider loggedInState={applicationState.state}>
      <SelectedRoomProvider>
        <LoggedInLayout>
          <Outlet />
        </LoggedInLayout>
      </SelectedRoomProvider>
    </LoggedInProvider>
  );
}
