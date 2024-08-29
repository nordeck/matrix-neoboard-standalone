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

import {
  ClientEventHandlerMap,
  EmittedEvents,
  MatrixClient,
  TypedEventEmitter,
} from 'matrix-js-sdk';
import { Mocked, vi } from 'vitest';

let eventId = 1;

const defaultMockProperties: Partial<MatrixClient> = {
  getUserId: vi.fn().mockReturnValue('@user:example.com'),
  kick: vi.fn(),
  members: vi.fn().mockResolvedValue({ chunk: [] }),
  sendStateEvent: vi.fn().mockResolvedValue({
    event_id: `event-${eventId++}`,
  }),
};

/**
 * Mock client with real event emitter
 * useful for testing code that listens
 * to MatrixClient events
 */
export class MockClientWithEventEmitter extends TypedEventEmitter<
  EmittedEvents,
  ClientEventHandlerMap
> {
  constructor(mockProperties: Partial<MatrixClient> = {}) {
    super();
    Object.assign(this, defaultMockProperties);
    Object.assign(this, mockProperties);
  }

  public destroy() {
    this.removeAllListeners();
  }
}

/**
 * - make a mock client
 * - cast the type to mocked(MatrixClient)
 * - spy on MatrixClientPeg.get to return the mock
 * eg
 * ```
 * const mockClient = getMockClientWithEventEmitter({
        getUserId: vi.fn().mockReturnValue(aliceId),
    });
 * ```
 */
export const getMockClientWithEventEmitter = (
  mockProperties: Partial<MatrixClient> = {},
): Mocked<MatrixClient> => {
  const mock = vi.mocked(
    new MockClientWithEventEmitter(mockProperties) as unknown as MatrixClient,
  );
  return mock;
};
