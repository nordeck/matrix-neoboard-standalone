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
