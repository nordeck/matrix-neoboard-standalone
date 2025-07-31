/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import { Observable } from 'rxjs';
import { Mocked, vi } from 'vitest';
import { StandaloneClient } from './types';

export type MockedStandaloneClient = Mocked<StandaloneClient>;

export function mockStandaloneClient(): MockedStandaloneClient {
  return {
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    leaveRoom: vi.fn(),
    closeRoom: vi.fn(),
    eventsObservable: vi.fn().mockReturnValue(new Observable()),
    toDeviceMessagesObservable: vi.fn().mockReturnValue(new Observable()),
    // @ts-expect-error - T doesn't matter here
    receiveStateEvents: vi.fn(),
    sendStateEvent: vi.fn(),
    sendDelayedStateEvent: vi
      .fn()
      .mockResolvedValue('syd_bcooaGNyKtyFbIGjGMQR'),
    // @ts-expect-error - T doesn't matter here
    receiveRoomEvents: vi.fn(),
    sendRoomEvent: vi.fn(),
    sendDelayedRoomEvent: vi.fn().mockResolvedValue('syd_wlGAStYmBRRdjnWiHSDA'),
    updateDelayedEvent: vi.fn().mockResolvedValue(undefined),
    readEventRelations: vi.fn(),
    observeTurnServers: vi.fn(),
    searchUserDirectory: vi.fn(),
    getMediaConfig: vi.fn(),
    uploadFile: vi.fn(),
    downloadFile: vi.fn(),
    sendToDeviceMessage: vi.fn(),
    getRoom: vi.fn(),
  };
}
