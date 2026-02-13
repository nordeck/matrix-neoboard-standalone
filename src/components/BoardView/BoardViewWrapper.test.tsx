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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BoardViewWrapper } from './BoardViewWrapper';

type MockState = {
  whiteboardByRoomId: Record<string, unknown>;
  invitesByUserId: Record<string, Array<{ roomId: string }>>;
};

let mockState: MockState;

vi.mock('../../store', async () => {
  const actual =
    await vi.importActual<typeof import('../../store')>('../../store');
  return {
    ...actual,
    makeSelectWhiteboard: (roomId: string) => (state: MockState) =>
      state.whiteboardByRoomId[roomId],
    useAppSelector: (selector: (state: MockState) => unknown) =>
      selector(mockState),
  };
});

vi.mock('../../store/api/selectors/selectInvites', () => ({
  makeSelectInvites: (userId: string) => (state: MockState) =>
    state.invitesByUserId[userId] ?? [],
}));

vi.mock('../../state', () => ({
  useLoggedIn: () => ({ userId: 'user-id' }),
}));

vi.mock('../RoomIdProvider', () => ({
  useOpenedRoomId: () => 'room-1',
}));

vi.mock('./BoardView', () => ({
  BoardView: () => <div>BoardView</div>,
}));

vi.mock('./BoardNotFound', () => ({
  BoardNotFound: () => <div>BoardNotFound</div>,
}));

vi.mock('./BoardInvite', () => ({
  BoardInvite: () => <div>BoardInvite</div>,
}));

describe('BoardViewWrapper', () => {
  beforeEach(() => {
    mockState = {
      whiteboardByRoomId: {},
      invitesByUserId: {},
    };
  });

  it('renders the board when the whiteboard exists', () => {
    mockState.whiteboardByRoomId['room-1'] = {
      roomName: 'Board',
      whiteboard: {},
    };

    render(<BoardViewWrapper />);

    expect(screen.getByText('BoardView')).toBeInTheDocument();
  });

  it('renders the invite view when there is a pending invite', () => {
    mockState.invitesByUserId['user-id'] = [{ roomId: 'room-1' }];

    render(<BoardViewWrapper />);

    expect(screen.getByText('BoardInvite')).toBeInTheDocument();
  });

  it('renders not found when there is no board or invite', () => {
    render(<BoardViewWrapper />);

    expect(screen.getByText('BoardNotFound')).toBeInTheDocument();
  });
});
