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

import { StateEvent } from '@matrix-widget-toolkit/api';
import { isValidEvent } from '@nordeck/matrix-neoboard-react-sdk/src/model/validation';
import Joi from 'joi';

export const STATE_EVENT_WHITEBOARD_SESSIONS =
  'net.nordeck.whiteboard.sessions';

export type WhiteboardSessionsEvent = {};

const whiteboardSessionsEventSchema = Joi.object<WhiteboardSessionsEvent, true>(
  {},
).unknown();

export function isValidWhiteboardSessionsEvent(
  event: StateEvent<unknown>,
): event is StateEvent<WhiteboardSessionsEvent> {
  return isValidEvent(
    event,
    STATE_EVENT_WHITEBOARD_SESSIONS,
    whiteboardSessionsEventSchema,
  );
}
