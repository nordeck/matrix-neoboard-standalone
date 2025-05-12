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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import {
  ROOM_EVENT_DOCUMENT_CREATE,
  STATE_EVENT_WHITEBOARD,
} from '@nordeck/matrix-neoboard-react-sdk';
import { StandaloneClient } from '../../toolkit/standalone';

/**
 * Creates a whiteboard and the widget in already created room.
 * - Follows the same room/whiteboard initialization as neoboard widget does: https://github.com/nordeck/matrix-neoboard/blob/f1222f6d41442861b5e3075c722280effddc679e/packages/react-sdk/src/state/useOwnedWhiteboard.tsx#L74-L101
 * - Sends neoboard widget and layout event
 * @param standaloneClient Standalone Client
 * @param roomId room id
 */
export async function createWhiteboard(
  standaloneClient: StandaloneClient,
  roomId: string,
): Promise<void> {
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

  const widgetBaseUrl = getEnvironment('REACT_APP_WIDGET_BASE');

  if (widgetBaseUrl) {
    const widgetUrl = new URL(
      '/#/?theme=$org.matrix.msc2873.client_theme&matrix_user_id=$matrix_user_id&matrix_display_name=$matrix_display_name&matrix_avatar_url=$matrix_avatar_url&matrix_room_id=$matrix_room_id&matrix_client_id=$org.matrix.msc2873.client_id&matrix_client_language=$org.matrix.msc2873.client_language&matrix_base_url=$org.matrix.msc4039.matrix_base_url&matrix_device_id=$org.matrix.msc3819.matrix_device_id',
      widgetBaseUrl,
    );

    // setup widget and layout
    await Promise.all([
      standaloneClient.sendStateEvent(
        'im.vector.modular.widgets',
        'neoboard',
        {
          type: 'net.nordeck.whiteboard',
          url: widgetUrl.toString(),
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
  }
}
