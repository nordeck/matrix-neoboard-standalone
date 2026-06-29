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

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentType, PropsWithChildren, useState } from 'react';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockLoggedInApis } from '../../lib/testUtils';
import { LoggedInProvider } from '../../state';
import { createStore, initializeStore, InviteEntry } from '../../store';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from '../../toolkit/standalone/client/mockStandaloneClient';
import { BoardInvite } from './BoardInvite';

vi.mock('react-router', async () => ({
  ...(await vi.importActual<typeof import('react-router')>('react-router')),
  useNavigate: vi.fn(),
}));

const userId = '@alice:example.com';

let standaloneClient: MockedStandaloneClient;
let mockNavigate: ReturnType<typeof vi.fn>;

describe('<BoardInvite />', () => {
  let Wrapper: ComponentType<PropsWithChildren>;
  let invite: InviteEntry;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const roomId = '!room-id:example.org';

    standaloneClient = mockStandaloneClient();
    const { standaloneApi, widgetApi, loggedInState } = mockLoggedInApis({
      userId,
      roomId,
      standaloneClient,
    });

    Wrapper = ({ children }: PropsWithChildren) => {
      const [store] = useState(() => {
        const store = createStore({
          standaloneApi,
          widgetApi,
        });
        initializeStore(store);
        return store;
      });

      return (
        <Provider store={store}>
          <LoggedInProvider loggedInState={loggedInState}>
            {children}
          </LoggedInProvider>
        </Provider>
      );
    };

    invite = {
      roomId,
      roomName: 'Test Board',
      senderUserId: '@user-id:example.com',
      senderDisplayName: 'User',
    };
  });

  it('should render invite', async () => {
    render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

    expect(
      await screen.findByText('You have been invited to the following board:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Board')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Accept Invite' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reject Invite' }),
    ).toBeInTheDocument();
  });

  describe('accept invite', () => {
    it('should join the room when clicking accept', async () => {
      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Accept Invite' }),
      );

      await waitFor(() => {
        expect(standaloneClient.joinRoom).toHaveBeenCalledWith(
          '!room-id:example.org',
        );
      });
    });

    it('should remove room from declined rooms when accepting', async () => {
      const key = `neoboard-declined-rooms-${userId}`;

      // Pre-populate localStorage with declined rooms
      window.localStorage.setItem(
        key,
        JSON.stringify(['!room-id:example.org', '!room-id-1:example.org']),
      );

      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Accept Invite' }),
      );

      await waitFor(() => {
        expect(standaloneClient.joinRoom).toHaveBeenCalledWith(
          '!room-id:example.org',
        );
      });

      const stored = window.localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(['!room-id-1:example.org']));
    });
  });

  describe('reject invite', () => {
    it('should open confirmation dialog when clicking reject', async () => {
      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Reject Invite' }),
      );

      const dialog = await screen.findByRole('dialog', {
        name: /Are you sure you want to reject this invite/i,
      });

      expect(dialog).toBeInTheDocument();
      expect(
        within(dialog).getByText(
          /Rejecting this invite means you will not be able to join/i,
        ),
      ).toBeInTheDocument();
    });

    it('should cancel rejection and close dialog', async () => {
      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Reject Invite' }),
      );

      const dialog = await screen.findByRole('dialog', {
        name: /Are you sure you want to reject this invite/i,
      });

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Cancel' }),
      );

      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
    });

    it('should leave the room and save to localStorage on confirmation', async () => {
      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Reject Invite' }),
      );

      const dialog = await screen.findByRole('dialog', {
        name: /Are you sure you want to reject this invite/i,
      });

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Reject invite' }),
      );

      await waitFor(() => {
        expect(standaloneClient.leaveRoom).toHaveBeenCalledWith(
          '!room-id:example.org',
        );
      });

      const key = `neoboard-declined-rooms-${userId}`;
      expect(window.localStorage.getItem(key)).toBe(
        JSON.stringify(['!room-id:example.org']),
      );
    });

    it('should navigate to dashboard after rejection', async () => {
      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Reject Invite' }),
      );

      const dialog = await screen.findByRole('dialog', {
        name: /Are you sure you want to reject this invite/i,
      });

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Reject invite' }),
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
          state: { inviteDeclined: true },
          replace: true,
        });
      });
    });

    it('should not duplicate room in declined rooms list', async () => {
      const key = `neoboard-declined-rooms-${userId}`;

      window.localStorage.setItem(
        key,
        JSON.stringify(['!room-id:example.org']),
      );

      render(<BoardInvite invite={invite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Reject Invite' }),
      );

      const dialog = await screen.findByRole('dialog', {
        name: /Are you sure you want to reject this invite/i,
      });

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Reject invite' }),
      );

      await waitFor(() => {
        expect(standaloneClient.leaveRoom).toHaveBeenCalledWith(
          '!room-id:example.org',
        );
      });

      const stored = window.localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(['!room-id:example.org']));
    });
  });
});
