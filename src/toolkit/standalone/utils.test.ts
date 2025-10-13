// SPDX-FileCopyrightText: 2022 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2022 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { RoomEvent, StateEvent } from '@matrix-widget-toolkit/api';
import { Symbols } from 'matrix-widget-api';
import { beforeEach, describe, expect, it } from 'vitest';
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
