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

import { MatrixClient } from 'matrix-js-sdk';
import { afterEach, beforeEach, describe, expect, it, Mocked } from 'vitest';
import {
  createMembershipEvent,
  getMockClientWithEventEmitter,
} from '../../../lib/test';
import { STATE_EVENT_TOMBSTONE } from '../../../model';
import { MatrixStandaloneClient } from './MatrixStandaloneClient';
import { StandaloneClient } from './types';

describe('MatrixStandaloneClient', () => {
  let matrixClient: Mocked<MatrixClient>;
  let standaloneClient: StandaloneClient;

  beforeEach(() => {
    matrixClient = getMockClientWithEventEmitter();
    standaloneClient = new MatrixStandaloneClient(matrixClient);
  });

  afterEach(() => {
    matrixClient.removeAllListeners();
  });

  describe('closeRoom', () => {
    it('should send a tombstone event', async () => {
      await standaloneClient.closeRoom('!room:example.com');

      expect(matrixClient.sendStateEvent).toHaveBeenCalledWith(
        '!room:example.com',
        STATE_EVENT_TOMBSTONE,
        {
          body: 'This room has been closed',
          replacement_room: '',
        },
        '',
      );
    });

    it('should kick all users, that are members, invited or have knocked', async () => {
      matrixClient.members.mockResolvedValue({
        chunk: [
          createMembershipEvent({
            userId: '@join:example.com',
            membership: 'join',
          }),
          createMembershipEvent({
            userId: '@knock:example.com',
            membership: 'knock',
          }),
          createMembershipEvent({
            userId: '@invite:example.com',
            membership: 'invite',
          }),
          createMembershipEvent({
            userId: '@leave:example.com',
            membership: 'leave',
          }),
          createMembershipEvent({
            userId: '@ban:example.com',
            membership: 'ban',
          }),
        ],
      });

      await standaloneClient.closeRoom('!room:example.com');

      expect(matrixClient.kick).toHaveBeenCalledTimes(3);
      expect(matrixClient.kick).toHaveBeenCalledWith(
        '!room:example.com',
        '@join:example.com',
        'Room closed',
      );
      expect(matrixClient.kick).toHaveBeenCalledWith(
        '!room:example.com',
        '@knock:example.com',
        'Room closed',
      );
      expect(matrixClient.kick).toHaveBeenCalledWith(
        '!room:example.com',
        '@invite:example.com',
        'Room closed',
      );
    });
  });
});
