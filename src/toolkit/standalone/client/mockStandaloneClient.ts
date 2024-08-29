/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from 'rxjs';
import { Mocked, vi } from 'vitest';
import { StandaloneClient } from './types';

export type MockedStandaloneClient = Mocked<StandaloneClient>;

export function mockStandaloneClient(): MockedStandaloneClient {
  return {
    createRoom: vi.fn(),
    closeRoom: vi.fn(),
    eventsObservable: vi.fn().mockReturnValue(new Observable()),
    toDeviceMessagesObservable: vi.fn().mockReturnValue(new Observable()),
    // @ts-expect-error - T doesn't matter here
    receiveStateEvents: vi.fn(),
    sendStateEvent: vi.fn(),
    // @ts-expect-error - T doesn't matter here
    receiveRoomEvents: vi.fn(),
    sendRoomEvent: vi.fn(),
    readEventRelations: vi.fn(),
    observeTurnServers: vi.fn(),
    searchUserDirectory: vi.fn(),
    getMediaConfig: vi.fn(),
    uploadFile: vi.fn(),
    sendToDeviceMessage: vi.fn(),
  };
}
