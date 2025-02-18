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
