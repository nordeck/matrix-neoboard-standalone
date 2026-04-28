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
import { ComponentType, PropsWithChildren, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggedInProvider, LoggedInState } from '../../state';
import { StandaloneClient } from '../../toolkit/standalone';
import { BoardInvite } from './BoardInvite';

interface MockStandaloneClient extends Partial<StandaloneClient> {
  joinRoom: ReturnType<typeof vi.fn>;
  leaveRoom: ReturnType<typeof vi.fn>;
}

vi.mock('react-router', async () => ({
  ...(await vi.importActual<typeof import('react-router')>('react-router')),
  useNavigate: vi.fn(),
}));

describe('<BoardInvite />', () => {
  let Wrapper: ComponentType<PropsWithChildren>;
  let client: MockStandaloneClient;
  let userId: string;
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    userId = '@bob:example.org';
    client = {
      joinRoom: vi.fn().mockResolvedValue(undefined),
      leaveRoom: vi.fn().mockResolvedValue(undefined),
    };

    Wrapper = ({ children }: PropsWithChildren) => {
      const loggedInState = useMemo(
        () => ({
          userId,
          deviceId: 'device-1',
          homeserverUrl: 'https://example.org',
          standaloneClient: client as unknown as StandaloneClient,
          resolveWidgetApi: vi.fn(),
          widgetApiPromise: new Promise<never>(() => {}),
        }),
        [],
      );

      return (
        <LoggedInProvider
          loggedInState={loggedInState as unknown as LoggedInState}
        >
          {children}
        </LoggedInProvider>
      );
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultInvite = {
    roomId: 'room-1',
    roomName: 'Test Board',
    senderUserId: '@alice:example.org',
    senderDisplayName: 'Alice',
  };

  describe('rendering', () => {
    it('should render the invite card', () => {
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

      expect(
        screen.getByText('You have been invited to the following board:'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Board')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Accept Invite' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Reject Invite' }),
      ).toBeInTheDocument();
    });
  });

  describe('accept invite', () => {
    it('should join the room when clicking accept', async () => {
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Accept Invite' }),
      );

      await waitFor(() => {
        expect(client.joinRoom).toHaveBeenCalledWith('room-1');
      });
    });

    it('should remove room from declined invites when accepting', async () => {
      const key = `neoboard:declinedInvites:${userId}`;

      // Pre-populate localStorage with declined rooms
      window.localStorage.setItem(key, JSON.stringify(['room-1', 'room-2']));

      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Accept Invite' }),
      );

      await waitFor(() => {
        expect(client.joinRoom).toHaveBeenCalledWith('room-1');
      });

      const stored = window.localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(['room-2']));
    });

    it('should clear localStorage entry if no declined rooms remain', async () => {
      const key = `neoboard:declinedInvites:${userId}`;

      // Pre-populate with only this room
      window.localStorage.setItem(key, JSON.stringify(['room-1']));

      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

      await userEvent.click(
        screen.getByRole('button', { name: 'Accept Invite' }),
      );

      await waitFor(() => {
        expect(client.joinRoom).toHaveBeenCalledWith('room-1');
      });

      // localStorage entry should be removed entirely
      expect(window.localStorage.getItem(key)).toBeNull();
    });
  });

  describe('reject invite', () => {
    it('should open confirmation dialog when clicking reject', async () => {
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

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
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

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
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

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
        expect(client.leaveRoom).toHaveBeenCalledWith('room-1');
      });

      const key = `neoboard:declinedInvites:${userId}`;
      expect(window.localStorage.getItem(key)).toBe(JSON.stringify(['room-1']));
    });

    it('should navigate to dashboard after rejection', async () => {
      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

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

    it('should not duplicate room in declined invites list', async () => {
      const key = `neoboard:declinedInvites:${userId}`;

      // Pre-populate with the same room
      window.localStorage.setItem(key, JSON.stringify(['room-1']));

      render(<BoardInvite invite={defaultInvite} />, { wrapper: Wrapper });

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
        expect(client.leaveRoom).toHaveBeenCalledWith('room-1');
      });

      // Should still be ['room-1'], not ['room-1', 'room-1']
      const stored = window.localStorage.getItem(key);
      expect(stored).toBe(JSON.stringify(['room-1']));
    });
  });
});
