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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { render, screen } from '@testing-library/react';
import { ComponentType, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockLoggedInApis } from '../../lib/testUtils';
import { setRedirectPath } from '../../redirectPath';
import { Application } from '../../state';
import { ApplicationProvider } from '../../state/useApplication';
import { createStore, initializeStore } from '../../store';
import { mockStandaloneClient } from '../../toolkit/standalone/client/mockStandaloneClient';
import { Login } from './Login';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

const homeserverUrl = 'https://matrix.example.com';
const roomId = '!room-id:example.com';
const userId = '@user-id:example.com';

describe('<Login />', () => {
  let Wrapper: ComponentType<PropsWithChildren>;

  beforeEach(async () => {
    vi.mocked(getEnvironment).mockImplementation(
      (_, defaultValue) => defaultValue,
    );

    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    const { standaloneApi, widgetApi } = mockLoggedInApis({
      userId,
      roomId,
      standaloneClient: mockStandaloneClient(),
    });
    const application = new Application();
    const store = createStore({ standaloneApi, widgetApi });
    await initializeStore(store);

    Wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>
        <ApplicationProvider application={application}>
          {children}
        </ApplicationProvider>
      </Provider>
    );
  });

  it('should render without exploding', () => {
    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.getByRole('heading', { name: 'NeoBoard', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Visual Collaboration for Teams',
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  it('should show user login if there is no homeserver configured', () => {
    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.getByRole('textbox', { name: 'Homeserver' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('should not show homeserver user login field if there is a homeserver configured', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        default:
          return defaultValue;
      }
    });

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.queryByRole('textbox', { name: 'Homeserver' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('should not show user login if it is skipped', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        case 'REACT_APP_SKIP_USER_LOGIN':
          return 'true';
        default:
          return defaultValue;
      }
    });

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.queryByRole('textbox', { name: 'Homeserver' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Log In' }),
    ).not.toBeInTheDocument();
  });

  it('should show the guest login if board should be joined', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        case 'REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN':
          return 'false';
        default:
          return defaultValue;
      }
    });
    setRedirectPath(`/board/${roomId}`);

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.getByRole('button', { name: 'Join as guest' }),
    ).toBeInTheDocument();
  });

  it('should not show the guest login if no board to join', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        case 'REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN':
          return 'false';
        default:
          return defaultValue;
      }
    });

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.queryByRole('button', { name: 'Join as guest' }),
    ).not.toBeInTheDocument();
  });

  it('should not show the guest login if skipped', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        case 'REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN':
          return 'true';
        default:
          return defaultValue;
      }
    });
    setRedirectPath(`/board/${roomId}`);

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.queryByRole('button', { name: 'Join as guest' }),
    ).not.toBeInTheDocument();
  });

  it('should not show the guest login by default', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        default:
          return defaultValue;
      }
    });
    setRedirectPath(`/board/${roomId}`);

    render(<Login />, { wrapper: Wrapper });

    expect(
      screen.queryByRole('button', { name: 'Join as guest' }),
    ).not.toBeInTheDocument();
  });

  it('should show use and guest logins', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return homeserverUrl;
        case 'REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN':
          return 'false';
        default:
          return defaultValue;
      }
    });
    setRedirectPath(`/board/${roomId}`);

    render(<Login />, { wrapper: Wrapper });

    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Join as guest' }),
    ).toBeInTheDocument();
  });
});
