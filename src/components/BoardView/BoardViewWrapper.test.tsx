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
import { ComponentType, PropsWithChildren, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockRoomMember,
  mockRoomName,
  mockWhiteboard,
} from '../../../../matrix-neoboard/packages/react-sdk/src/lib/testUtils/matrixTestUtils';
import { mockLoggedInApis } from '../../lib/testUtils';
import { LoggedInProvider } from '../../state';
import { createStore, initializeStore } from '../../store';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from '../../toolkit/standalone/client/mockStandaloneClient';
import { RoomIdMockProvider } from '../RoomIdProvider';
import { BoardViewWrapper } from './BoardViewWrapper';

vi.mock('./BoardView', () => ({
  BoardView: () => <div>Board View</div>,
}));

const roomId = '!room-id:example.com';
const userId = '@alice:example.com';

let standaloneClient: MockedStandaloneClient;

describe('<BoardViewWrapper />', () => {
  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    standaloneClient = mockStandaloneClient();
    const { standaloneApi, widgetApi, loggedInState } = mockLoggedInApis({
      userId,
      roomId,
      standaloneClient,
    });

    Wrapper = ({ children }) => {
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
          <MemoryRouter>
            <LoggedInProvider loggedInState={loggedInState}>
              <RoomIdMockProvider value={{ roomId }}>
                {children}
              </RoomIdMockProvider>
            </LoggedInProvider>
          </MemoryRouter>
        </Provider>
      );
    };
  });

  it('should render board not found if not invited', async () => {
    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(await screen.findByText('Board not found')).toBeInTheDocument();
  });

  it('should render BoardView when whiteboard exists', async () => {
    standaloneClient.receiveStateEvents.mockImplementation((eventType) => {
      if (eventType === 'm.room.name') {
        return Promise.resolve([mockRoomName()]);
      }

      if (eventType === 'net.nordeck.whiteboard') {
        return Promise.resolve([mockWhiteboard()]);
      }

      return Promise.resolve([]);
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(await screen.findByText('Board View')).toBeInTheDocument();
  });

  it('should render board invite', async () => {
    standaloneClient.receiveStateEvents.mockImplementation((eventType) => {
      if (eventType === 'm.room.name') {
        return Promise.resolve([mockRoomName()]);
      }

      if (eventType === 'm.room.member') {
        return Promise.resolve([
          mockRoomMember({
            state_key: userId,
            content: {
              membership: 'invite',
            },
          }),
        ]);
      }

      return Promise.resolve([]);
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(
      await screen.findByText(/You have been invited to the following board/),
    ).toBeInTheDocument();
  });

  it('should render board no access if invite was declined', async () => {
    const key = `neoboard-declined-rooms-${userId}`;
    localStorage.setItem(key, JSON.stringify([roomId]));

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(await screen.findByText("Can't access board")).toBeInTheDocument();
  });

  it('should render board invite if invite was declined and invited again', async () => {
    const key = `neoboard-declined-rooms-${userId}`;
    localStorage.setItem(key, JSON.stringify([roomId]));

    standaloneClient.receiveStateEvents.mockImplementation((eventType) => {
      if (eventType === 'm.room.name') {
        return Promise.resolve([mockRoomName()]);
      }

      if (eventType === 'm.room.member') {
        return Promise.resolve([
          mockRoomMember({
            state_key: userId,
            content: {
              membership: 'invite',
            },
          }),
        ]);
      }

      return Promise.resolve([]);
    });

    render(<BoardViewWrapper />, { wrapper: Wrapper });

    expect(
      await screen.findByText(/You have been invited to the following board/),
    ).toBeInTheDocument();
  });
});
