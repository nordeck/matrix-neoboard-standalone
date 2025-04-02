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

import { useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';
import './App.css';
import { BoardViewWrapper } from './components/BoardView';
import { Dashboard } from './components/Dashboard';
import { LoggedInLayout } from './components/LoggedInLayout';
import { RoomIdProvider } from './components/RoomIdProvider';
import { StandaloneThemeProvider } from './components/StandaloneThemeProvider';
import { StartingView } from './components/StartingView';
import { WelcomePane } from './components/Welcome/WelcomePane';
import {
  clearRedirectPath,
  getRedirectPath,
  setRedirectPath,
} from './redirectPath';
import { LoggedInProvider, useApplicationState } from './state';

export const App = () => {
  const { lifecycleState } = useApplicationState();

  return (
    <StandaloneThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes for Logged In Users */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardWithRedirect />} />
            <Route path="/board/:roomId" element={<BoardViewWrapper />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
          {['notLoggedIn', 'loggedOut'].includes(lifecycleState) && (
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
  const location = useLocation();

  switch (lifecycleState) {
    case 'starting':
      return <StartingView />;

    case 'notLoggedIn':
    case 'loggedOut':
      // Save board URLs for redirect after login (only when not logged in)
      if (
        lifecycleState === 'notLoggedIn' &&
        location.pathname.startsWith('/board/')
      ) {
        setRedirectPath(location.pathname);
      }
      return <Navigate to="/login" replace />;

    case 'loggedIn':
      return (
        <LoggedInProvider loggedInState={applicationState.state}>
          <RoomIdProvider>
            <LoggedInLayout>
              <Outlet />
            </LoggedInLayout>
          </RoomIdProvider>
        </LoggedInProvider>
      );

    default:
      return <Navigate to="/login" replace />;
  }
}

function DashboardWithRedirect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }

    const redirectPath = getRedirectPath();
    if (redirectPath) {
      hasRedirected.current = true;
      clearRedirectPath();
      navigate(redirectPath);
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <StartingView />;
  } else {
    return <Dashboard />;
  }
}
