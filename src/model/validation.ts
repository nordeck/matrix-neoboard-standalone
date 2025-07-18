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

/**
 * @todo implement in widget toolkit
 */

import {
  RoomEvent,
  StateEvent,
  ToDeviceMessageEvent,
} from '@matrix-widget-toolkit/api';
import Joi from 'joi';
import loglevel from 'loglevel';

export function isValidEvent(
  event:
    | RoomEvent<unknown>
    | StateEvent<unknown>
    | ToDeviceMessageEvent<unknown>,
  eventType: string,
  schema: Joi.AnySchema,
  allowEmptyContent = false,
): boolean {
  if (event.type !== eventType) {
    return false;
  }

  if (
    !event.content ||
    typeof event.content !== 'object' ||
    Object.keys(event.content).length === 0
  ) {
    return allowEmptyContent;
  }

  const { error } = schema.validate(event.content);

  if (error) {
    loglevel.error('Event validation failed:', error.message, event);
    return false;
  }

  return true;
}
