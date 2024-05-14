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
import { StandaloneClient } from './types';

export type MockedStandaloneClient = jest.Mocked<StandaloneClient>;

export function mockStandaloneClient(): MockedStandaloneClient {
  return {
    createRoom: jest.fn(),
    eventsObservable: jest.fn().mockReturnValue(new Observable()),
    toDeviceMessagesObservable: jest.fn().mockReturnValue(new Observable()),
    receiveStateEvents: jest.fn(),
    sendStateEvent: jest.fn(),
    receiveRoomEvents: jest.fn(),
    sendRoomEvent: jest.fn(),
    readEventRelations: jest.fn(),
    observeTurnServers: jest.fn(),
    searchUserDirectory: jest.fn(),
    getMediaConfig: jest.fn(),
    uploadFile: jest.fn(),
    sendToDeviceMessage: jest.fn(),
  };
}
