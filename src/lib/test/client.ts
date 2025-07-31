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
  getRoom: vi.fn().mockResolvedValue(null),
  getVisibleRooms: vi.fn().mockReturnValue([]),
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
