/*
 * Copyright 2022 Nordeck IT + Consulting GmbH
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
import { isDefined, isInRoom } from './utils';

describe('isDefined', () => {
  it('should be defined for non null/undefined values', () => {
    expect(isDefined(true)).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined('test')).toBe(true);
    expect(isDefined({})).toBe(true);
  });

  it('should not be defined for non null values', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('should not be defined for non undefined values', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

describe('isInRoom', () => {
  let event: RoomEvent | StateEvent;

  beforeEach(() => {
    event = {
      type: 'com.example.test',
      event_id: 'event-id',
      origin_server_ts: 42,
      sender: 'user-id',
      content: {},
      room_id: 'test-room',
    };
  });

  it('should return true if wildcard room ids is passed', () => {
    expect(isInRoom(event, Symbols.AnyRoom)).toEqual(true);
  });

  it('should return true if matches any of room ids', () => {
    expect(isInRoom(event, ['my-room', 'test-room'])).toEqual(true);
  });

  it('should return false if not matches any of room ids', () => {
    expect(isInRoom(event, ['my-room'])).toEqual(false);
  });
});
