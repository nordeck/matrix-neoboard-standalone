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

import { useEffect, useRef, useState } from 'react';
import {
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
