/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

import { SnackbarProvider } from '@nordeck/matrix-neoboard-react-sdk';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentType, PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggedInProvider, LoggedInState } from '../../state';
import { StandaloneClient } from '../../toolkit/standalone';
import { BoardInvite } from './BoardInvite';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
const renderWithProviders = (ui: React.ReactElement) => {
  const client = {
    joinRoom: vi.fn().mockResolvedValue(undefined),
    leaveRoom: vi.fn().mockResolvedValue(undefined),
  };

  const loggedInState: LoggedInState = {
    userId: '@alice:example.org',
    deviceId: 'device-1',
    homeserverUrl: 'https://example.org',
    standaloneClient: client as unknown as StandaloneClient,
    resolveWidgetApi: vi.fn(),
    widgetApiPromise: new Promise(() => {}),
  };

  const Wrapper: ComponentType<PropsWithChildren> = ({ children }) => (
    <LoggedInProvider loggedInState={loggedInState}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </LoggedInProvider>
  );

  const utils = render(ui, { wrapper: Wrapper });

  return {
    ...utils,
    client,
    mockNavigate,
  };
};

describe('BoardInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts the invite when clicking accept', async () => {
    const { client } = renderWithProviders(
      <BoardInvite
        invite={{
          roomId: 'room-1',
          roomName: 'Board',
          senderUserId: '@alice:example.org',
        }}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Accept invite' }),
    );

    expect(client.joinRoom).toHaveBeenCalledWith('room-1');
  });

  it('rejects the invite when clicking reject and navigates', async () => {
    const { client, mockNavigate } = renderWithProviders(
      <BoardInvite
        invite={{
          roomId: 'room-1',
          roomName: 'Board',
          senderUserId: '@alice:example.org',
        }}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Reject invite' }),
    );
    expect(client.leaveRoom).toHaveBeenCalledWith('room-1');
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        state: { inviteDeclined: true },
        replace: true,
      });
    });
  });
});
