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

import { RoomEvent, StateEvent } from '@matrix-widget-toolkit/api';
import { Symbols } from 'matrix-widget-api';

export function isDefined<T>(arg: T | null | undefined): arg is T {
  return arg !== null && arg !== undefined;
}

export function isInRoom(
  matrixEvent: RoomEvent | StateEvent,
  roomIds: string[] | Symbols.AnyRoom,
): boolean {
  if (typeof roomIds === 'string') {
    if (roomIds !== Symbols.AnyRoom) {
      throw Error(`Unknown room id symbol: ${roomIds}`);
    }

    return true;
  }

  return roomIds.includes(matrixEvent.room_id);
}
