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
  ROOM_EVENT_DOCUMENT_CREATE,
  STATE_EVENT_WHITEBOARD,
} from '@nordeck/matrix-neoboard-react-sdk';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from '../../toolkit/standalone';
import { createWhiteboard } from './createWhiteboard.ts';

describe('createWhiteboard', () => {
  let standaloneClient: MockedStandaloneClient;

  beforeEach(() => {
    standaloneClient = mockStandaloneClient();
  });

  it('create a whiteboard', async () => {
    standaloneClient.createRoom.mockResolvedValue({ room_id: '!room-1' });
    standaloneClient.sendRoomEvent.mockResolvedValueOnce('document-id-1');

    await expect(createWhiteboard(standaloneClient)).resolves.toEqual(
      '!room-1',
    );

    expect(standaloneClient.createRoom).toHaveBeenCalled();

    expect(standaloneClient.sendRoomEvent).toHaveBeenCalledWith(
      ROOM_EVENT_DOCUMENT_CREATE,
      {},
      '!room-1',
    );

    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_WHITEBOARD,
      '!room-1_whiteboard',
      { documentId: 'document-id-1' },
      '!room-1',
    );

    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'im.vector.modular.widgets',
      'neoboard',
      expect.objectContaining({
        type: 'net.nordeck.whiteboard',
        url: expect.any(String),
        name: 'NeoBoard',
      }),
      '!room-1',
    );

    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'io.element.widgets.layout',
      '',
      expect.anything(),
      '!room-1',
    );
  });
});
