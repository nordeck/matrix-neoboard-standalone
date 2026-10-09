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

import {
  RoomMemberStateEventContent,
  StateEvent,
} from '@matrix-widget-toolkit/api';
import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ClientEvent,
  ClientEventHandlerMap,
  MatrixClient,
  Room,
  SyncState,
} from 'matrix-js-sdk';
import { ComponentType, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { first, firstValueFrom, ReplaySubject, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockLoggedInApis } from '../../lib/testUtils';
import { Application } from '../../state';
import { ApplicationProvider } from '../../state/useApplication';
import { createStore, initializeStore } from '../../store';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from '../../toolkit/standalone/client/mockStandaloneClient';
import { GuestLogin } from './GuestLogin';

import type { FetchMock } from 'vitest-fetch-mock';
import { mockRoomMember } from '../../../../matrix-neoboard/packages/react-sdk/src/lib/testUtils/matrixTestUtils';
import { MatrixCredentials } from '../../auth';
const fetch = global.fetch as FetchMock;

vi.mock('matrix-js-sdk', async () => ({
  ...(await vi.importActual('matrix-js-sdk')),
  MatrixClient: vi.fn(),
}));

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

const homeserverUrl = 'https://matrix.example.com';
const registerGuestUrl = `${homeserverUrl}/_synapse/client/register_guest`;
const roomId = '!room-id:example.com';
const guestUserId = '@guest-abc:example.com';

const matrixCredentials: MatrixCredentials = {
  accessToken: 'access_token',
  homeserverUrl,
  userId: guestUserId,
  deviceId: 'device_id',
};

describe('<GuestLogin />', () => {
  let standaloneClient: MockedStandaloneClient;
  let clientMock: MatrixClient;
  let eventsSubject: Subject<StateEvent<RoomMemberStateEventContent>>;
  let application: Application;

  let Wrapper: ComponentType<PropsWithChildren>;

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) =>
      name === 'REACT_APP_HOMESERVER' ? homeserverUrl : defaultValue,
    );

    // Guest registration succeeds by default
    fetch.mockResponse((req) => {
      if (req.url === registerGuestUrl) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matrixCredentials),
        };
      }

      return '';
    });

    clientMock = {
      startClient: vi.fn(),
      stopClient: vi.fn(),
      whoami: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      once: vi.fn(),
      knockRoom: vi.fn().mockResolvedValue(undefined),
      joinRoom: vi.fn().mockResolvedValue(undefined),
    } as unknown as MatrixClient;
    vi.mocked(MatrixClient).mockImplementation(function () {
      return clientMock;
    });

    vi.mocked(clientMock).once.mockImplementation((event, listener) => {
      if (event === ClientEvent.Sync) {
        (listener as ClientEventHandlerMap[ClientEvent.Sync])(
          SyncState.Prepared,
          null,
        );
      }
      return clientMock;
    });

    eventsSubject = new ReplaySubject<
      StateEvent<RoomMemberStateEventContent>
    >();
    vi.mocked(clientMock.knockRoom).mockImplementation(async () => {
      eventsSubject.next(
        mockRoomMember({
          state_key: guestUserId,
          content: { membership: 'invite' },
        }),
      );
      return { room_id: roomId };
    });
    vi.mocked(clientMock.joinRoom).mockImplementation(async () => {
      eventsSubject.next(
        mockRoomMember({
          state_key: guestUserId,
          content: { membership: 'join' },
        }),
      );
      return {} as Room;
    });

    standaloneClient = mockStandaloneClient();
    standaloneClient.eventsObservable.mockReturnValue(eventsSubject);

    const { standaloneApi, widgetApi } = mockLoggedInApis({
      userId: guestUserId,
      roomId,
      standaloneClient,
    });

    application = new Application();

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

  afterEach(async () => {
    application.destroy();
    fetch.resetMocks();
  });

  it('should render without exploding', () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    expect(
      screen.getByRole('textbox', { name: 'Display name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Join as guest' }),
    ).toBeInTheDocument();
  });

  it('should disable the join button if the display name is empty', () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    expect(
      screen.getByRole('button', { name: 'Join as guest' }),
    ).toBeDisabled();
  });

  it('should enable the join button if display name is entered', async () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      'Alice',
    );

    expect(screen.getByRole('button', { name: 'Join as guest' })).toBeEnabled();
  });

  it('should enable the join button if display name with space is entered', async () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    const input = screen.getByRole('textbox', { name: 'Display name' });
    await userEvent.type(input, 'Alice Alice');

    expect(input).toHaveValue('Alice Alice');
  });

  it('should disable the join button for a whitespace only display name', async () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      '   ',
    );

    expect(
      screen.getByRole('button', { name: 'Join as guest' }),
    ).toBeDisabled();
  });

  it('should register a guest', async () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      'Alice',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Join as guest' }),
    );

    await waitForLoggedIn(application);

    expect(vi.mocked(MatrixClient)).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: matrixCredentials.accessToken,
        baseUrl: homeserverUrl,
        deviceId: matrixCredentials.deviceId,
        userId: guestUserId,
      }),
    );

    expect(clientMock.startClient).toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledWith(
      new URL(registerGuestUrl),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ displayname: 'Alice' }),
      }),
    );
  });

  it('should register a guest and knock and join the room', async () => {
    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      'Alice',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Join as guest' }),
    );

    await waitForLoggedIn(application);

    expect(clientMock.knockRoom).toHaveBeenCalledWith(roomId);
    expect(clientMock.joinRoom).toHaveBeenCalledWith(roomId);
  });

  it('should show an error message if guest registration fails', async () => {
    fetch.mockResponse(() => ({ status: 403, body: '' }));

    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      'Alice',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Join as guest' }),
    );

    expect(
      await screen.findByText('Guest registration failed. Please try again.'),
    ).toBeInTheDocument();
    expect(clientMock.knockRoom).not.toHaveBeenCalled();
  });

  it('should show an error message if knocking the room fails', async () => {
    vi.mocked(clientMock.knockRoom).mockRejectedValue(new Error());

    render(<GuestLogin roomId={roomId} />, {
      wrapper: Wrapper,
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Display name' }),
      'Alice',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Join as guest' }),
    );

    expect(
      await screen.findByText('Failed to join as guest. Please try again.'),
    ).toBeInTheDocument();
    expect(clientMock.joinRoom).not.toHaveBeenCalled();
  });
});

async function waitForLoggedIn(application: Application): Promise<void> {
  await firstValueFrom(
    application
      .getStateSubject()
      .pipe(first((state) => state.lifecycleState === 'loggedIn')),
  );
}
