/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startLoginFlow } from '../../auth';
import { WelcomePane } from './WelcomePane';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

vi.mock('../../auth', async () => ({
  ...(await vi.importActual('../../auth')),
  startLoginFlow: vi.fn(),
}));

vi.mock('../Login', () => ({
  Login: () => <div data-testid="login-component">Login Component</div>,
}));

vi.mock('./WelcomeLogo', () => ({
  WelcomeLogo: () => <div data-testid="welcome-logo">Welcome Logo</div>,
}));

describe('<WelcomePane />', () => {
  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: PropsWithChildren<{}>) => (
      <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the welcome pane', () => {
    render(<WelcomePane />, {
      wrapper: Wrapper,
    });

    expect(screen.getByTestId('welcome-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(startLoginFlow).not.toHaveBeenCalled();
  });

  it('should render the welcome pane when homeserver name is configured', () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_HOMESERVER':
          return 'matrix.example.com';
        default:
          return defaultValue;
      }
    });

    render(<WelcomePane />, {
      wrapper: Wrapper,
    });

    expect(screen.getByTestId('welcome-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(startLoginFlow).not.toHaveBeenCalled();
  });
});
