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
  PowerLevelsStateEvent,
  StateEvent,
  hasStateEventPower,
} from '@matrix-widget-toolkit/api';
import { STATE_EVENT_ROOM_NAME } from '@nordeck/matrix-neoboard-react-sdk';
import { STATE_EVENT_TOMBSTONE } from '../../model';

export type WhiteboardPermissions = {
  canChangeName: boolean;
  canSendTombstone: boolean;
};

export function calculateWhiteboardPermissions(
  powerLevels: StateEvent<PowerLevelsStateEvent> | undefined,
  userId: string,
): WhiteboardPermissions {
  const result: WhiteboardPermissions = {
    canChangeName: false,
    canSendTombstone: false,
  };

  if (powerLevels?.content) {
    result.canChangeName = hasStateEventPower(
      powerLevels.content,
      userId,
      STATE_EVENT_ROOM_NAME,
    );
    result.canSendTombstone = hasStateEventPower(
      powerLevels.content,
      userId,
      STATE_EVENT_TOMBSTONE,
    );
  }

  return result;
}
