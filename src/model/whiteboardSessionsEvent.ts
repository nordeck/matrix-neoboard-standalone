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

import { StateEvent } from '@matrix-widget-toolkit/api';
import {
  matrixRtcMode,
  STATE_EVENT_RTC_MEMBER,
  STATE_EVENT_WHITEBOARD_SESSIONS,
} from '@nordeck/matrix-neoboard-react-sdk';
import Joi from 'joi';
import { isValidEvent } from './validation';

export type WhiteboardSessionsEvent = {};

const whiteboardSessionsEventSchema = Joi.object<WhiteboardSessionsEvent, true>(
  {},
).unknown();

export const STATE_EVENT_SESSION = matrixRtcMode
  ? STATE_EVENT_RTC_MEMBER
  : STATE_EVENT_WHITEBOARD_SESSIONS;

export function isValidWhiteboardSessionsEvent(
  event: StateEvent<unknown>,
): event is StateEvent<WhiteboardSessionsEvent> {
  return isValidEvent(
    event,
    STATE_EVENT_SESSION,
    whiteboardSessionsEventSchema,
    true,
  );
}
