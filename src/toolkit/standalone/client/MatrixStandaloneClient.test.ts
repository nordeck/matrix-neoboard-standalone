// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
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
