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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BoardInvite } from './BoardInvite';

const mocks = vi.hoisted(() => ({
  joinRoom: vi.fn(),
  leaveRoom: vi.fn(),
}));

vi.mock('../../state', () => ({
  useLoggedIn: () => ({
    standaloneClient: {
      joinRoom: mocks.joinRoom,
      leaveRoom: mocks.leaveRoom,
    },
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string, options?: { name?: string }) => {
      if (typeof defaultValue === 'string' && options?.name) {
        return defaultValue.replace('{{name}}', options.name);
      }
      return defaultValue ?? key;
    },
  }),
}));

describe('BoardInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts the invite when clicking accept', async () => {
    render(
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

    expect(mocks.joinRoom).toHaveBeenCalledWith('room-1');
  });

  it('rejects the invite when clicking reject', async () => {
    render(
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

    expect(mocks.leaveRoom).toHaveBeenCalledWith('room-1');
  });
});
