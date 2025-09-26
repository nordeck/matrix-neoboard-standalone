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
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { startLoginFlow } from '../../lib/oidc';
import { WelcomePane } from './WelcomePane';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

vi.mock('../../lib/oidc', () => ({
  startLoginFlow: vi.fn(),
}));

vi.mock('../Login/Login', () => ({
  Login: () => <div data-testid="login-component">Login Component</div>,
}));

vi.mock('./WelcomeLogo', () => ({
  WelcomeLogo: () => <div data-testid="welcome-logo">Welcome Logo</div>,
}));

const mockGetEnvironment = vi.mocked(getEnvironment);
const mockStartLoginFlow = vi.mocked(startLoginFlow);

// Test wrapper to provide router context
const TestWrapper = ({
  children,
  initialEntries = ['/login'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;

describe('<WelcomePane />', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('should render the welcome pane when no static server is configured', () => {
    mockGetEnvironment.mockReturnValue('');

    render(
      <TestWrapper>
        <WelcomePane />
      </TestWrapper>,
    );

    expect(screen.getByTestId('welcome-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(mockStartLoginFlow).not.toHaveBeenCalled();
  });

  it('should render the welcome pane when static server is configured but skipLogin is not present', () => {
    mockGetEnvironment.mockReturnValue('matrix.example.com');

    render(
      <TestWrapper initialEntries={['/login']}>
        <WelcomePane />
      </TestWrapper>,
    );

    expect(screen.getByTestId('welcome-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(mockStartLoginFlow).not.toHaveBeenCalled();
  });

  it('should skip the welcome pane and start login flow when static server is configured and skipLogin is present', () => {
    mockGetEnvironment.mockReturnValue('matrix.example.com');
    mockStartLoginFlow.mockResolvedValue();

    render(
      <TestWrapper initialEntries={['/login?skipLogin']}>
        <WelcomePane />
      </TestWrapper>,
    );

    expect(screen.queryByTestId('welcome-logo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-component')).not.toBeInTheDocument();
    expect(mockStartLoginFlow).toHaveBeenCalledWith('matrix.example.com');
  });
});
