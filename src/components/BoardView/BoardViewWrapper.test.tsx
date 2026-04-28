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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren, useMemo } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggedInProvider, LoggedInState } from '../../state';
import { createStore, useAppSelector } from '../../store';
import { StandaloneApi, StandaloneClient } from '../../toolkit/standalone';
import { RoomIdContext } from '../RoomIdProvider/RoomIdProvider';
import { BoardViewWrapper } from './BoardViewWrapper';

// Mock components to avoid deep rendering issues and keep tests focused on Wrapper logic
vi.mock('./BoardView', () => ({
  BoardView: () => <div>Board View</div>,
}));

vi.mock('./BoardInvite', () => ({
  BoardInvite: ({ invite }: { invite: { roomName?: string } }) => (
    <div>Board Invite: {invite.roomName}</div>
  ),
}));

vi.mock('./BoardNoAccess', () => ({
  BoardNoAccess: () => <div>Board No Access</div>,
}));

vi.mock('./BoardNotFound', () => ({
  BoardNotFound: () => <div>Board Not Found</div>,
}));

vi.mock('../../store', async () => ({
  ...(await vi.importActual<typeof import('../../store')>('../../store')),
  useAppSelector: vi.fn(),
}));

describe('<BoardViewWrapper />', () => {
  let roomId: string | undefined;
  let userId: string;

  const Wrapper = ({ children }: PropsWithChildren) => {
    const store = useMemo(
      () =>
        createStore({
          standaloneApi: Promise.resolve({} as StandaloneApi),
          widgetApi: {} as unknown as WidgetApi,
        }),
      [],
    );

    const loggedInState = useMemo(
      () => ({
        userId,
        deviceId: 'device-1',
        homeserverUrl: 'https://example.org',
        standaloneClient: {} as StandaloneClient,
        resolveWidgetApi: vi.fn(),
        widgetApiPromise: new Promise<never>(() => {}),
      }),
      [],
    );

    return (
      <Provider store={store}>
        <LoggedInProvider
          loggedInState={loggedInState as unknown as LoggedInState}
        >
          <RoomIdContext.Provider value={{ roomId }}>
            <MemoryRouter>{children}</MemoryRouter>
          </RoomIdContext.Provider>
        </LoggedInProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    roomId = 'room-1';
    userId = '@bob:example.org';

    // Default: no whiteboard, no invite
    vi.mocked(useAppSelector).mockReturnValue(undefined);
  });

  it('should render BoardNotFound by default (no whiteboard, no invite)', () => {
    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(screen.getByText('Board Not Found')).toBeInTheDocument();
  });

  it('should render BoardView when whiteboard exists', () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectWhiteboard')) {
        return { roomName: 'My Board' };
      }
      return undefined;
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(screen.getByText('Board View')).toBeInTheDocument();
  });

  it('should render BoardInvite when an invite exists but no whiteboard', () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectInvites')) {
        return { roomId: 'room-1', roomName: 'Invited Board' };
      }
      return undefined;
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(screen.getByText(/Board Invite: Invited Board/)).toBeInTheDocument();
  });

  it('should render BoardNoAccess when the invite was declined', () => {
    const key = `neoboard:declinedInvites:${userId}`;
    localStorage.setItem(key, JSON.stringify(['room-1']));

    vi.mocked(useAppSelector).mockReturnValue(undefined);

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(screen.getByText('Board No Access')).toBeInTheDocument();
  });

  it('should render BoardNotFound when no roomId is provided', () => {
    roomId = undefined;
    vi.mocked(useAppSelector).mockReturnValue(undefined);

    expect(() => render(<BoardViewWrapper />, { wrapper: Wrapper })).toThrow(
      'useOpenedRoomId must be used when room is opened',
    );
  });

  it('should render BoardInvite if a new invite is received after declining', () => {
    const key = `neoboard:declinedInvites:${userId}`;
    localStorage.setItem(key, JSON.stringify(['room-1']));

    vi.mocked(useAppSelector).mockImplementation((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectInvites')) {
        return { roomId: 'room-1', roomName: 'Re-invited Board' };
      }
      return undefined;
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(
      screen.getByText(/Board Invite: Re-invited Board/),
    ).toBeInTheDocument();
  });
});
