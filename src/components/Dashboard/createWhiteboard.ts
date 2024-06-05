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
  STATE_EVENT_WHITEBOARD_SESSIONS,
} from '@nordeck/matrix-neoboard-react-sdk';
import { StandaloneClient } from '../../toolkit/standalone';

/**
 * Creates a room with whiteboard and the widget.
 * - Follows the same room/whiteboard initialization as neoboard widget does: https://github.com/nordeck/matrix-neoboard/blob/f1222f6d41442861b5e3075c722280effddc679e/packages/react-sdk/src/state/useOwnedWhiteboard.tsx#L74-L101
 * - Sends neoboard widget and layout event
 * @param standaloneClient Standalone Client
 * @param name room name
 */
export async function createWhiteboard(
  standaloneClient: StandaloneClient,
  name?: string,
): Promise<string> {
  const { room_id: roomId } = await standaloneClient.createRoom({
    name,
    power_level_content_override: {
      events: {
        [STATE_EVENT_WHITEBOARD_SESSIONS]: 0,
      },
    },
  });

  const documentId = await standaloneClient.sendRoomEvent(
    ROOM_EVENT_DOCUMENT_CREATE,
    {},
    roomId,
  );

  await standaloneClient.sendStateEvent(
    STATE_EVENT_WHITEBOARD,
    `${roomId}_whiteboard`,
    {
      documentId,
    },
    roomId,
  );

  // setup widget and layout
  await Promise.all([
    standaloneClient.sendStateEvent(
      'im.vector.modular.widgets',
      'neoboard',
      {
        type: 'net.nordeck.whiteboard',
        url: 'https://matrix-neoboard-widget.dev.nordeck.io/#/?theme=$org.matrix.msc2873.client_theme&matrix_user_id=$matrix_user_id&matrix_display_name=$matrix_display_name&matrix_avatar_url=$matrix_avatar_url&matrix_room_id=$matrix_room_id&matrix_client_id=$org.matrix.msc2873.client_id&matrix_client_language=$org.matrix.msc2873.client_language&matrix_base_url=$org.matrix.msc4039.matrix_base_url',
        name: 'NeoBoard',
      },
      roomId,
    ),
    standaloneClient.sendStateEvent(
      'io.element.widgets.layout',
      '',
      {
        widgets: {
          neoboard: {
            container: 'center',
          },
        },
      },
      roomId,
    ),
  ]);

  return roomId;
}
