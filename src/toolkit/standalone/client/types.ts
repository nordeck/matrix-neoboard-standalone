// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import {
  PowerLevelsStateEvent,
  RoomEvent,
  StateEvent,
  StateEventCreateContent,
  ToDeviceMessageEvent,
  WidgetApi,
} from '@matrix-widget-toolkit/api';
import { ICreateRoomOpts, IJoinRoomOpts, Room } from 'matrix-js-sdk';
import { Symbols, UpdateDelayedEventAction } from 'matrix-widget-api';
import { Observable } from 'rxjs';
/**
 * User Data of a matrix user.
 */
export type IUser = {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
};

/**
 * API for communication to the matrix server that would facilitate standalone apps and running widget in a
 * standalone mode.
 *
 * Similar to WidgetApi from the matrix widget toolkit, but with the following considered:
 * - A minimum API that would allow implementations of standalone widgets.
 * - Similar to WidgetApi from matrix widget toolkit for easier usage.
 * - roomId(s) are always passed explicitly in all the methods.
 * - Uses types from matrix widget toolkit.
 * - Methods that are needed and don't have any optional roomId(s) parameter are picked from WidgetApi.
 */
export type StandaloneClient = Pick<
  WidgetApi,
  | 'observeTurnServers'
  | 'searchUserDirectory'
  | 'getMediaConfig'
  | 'uploadFile'
  | 'downloadFile'
  | 'sendToDeviceMessage'
  | 'requestOpenIDConnectToken'
> & {
  /**
   * Invite a user to a room.
   *
   * @param roomId - The room id to invite the user to.
   * @param userId - The user id to invite.
   */
  invite(roomId: string, userId: string): Promise<void>;

  /**
   * Search for users in the user directory.
   *
   * @param searchTerm - The search term to search for.
   * @param limit - The maximum number of users to return.
   */
  searchUsers(searchTerm: string, limit?: number): Promise<IUser[]>;

  /**
   * Creates a new room
   * @param options - Options to create a room
   */
  createRoom(options: ICreateRoomOpts): Promise<{ room_id: string }>;

  /**
   * Join a room
   * @param roomId - The room id
   * @param options - Options to create a room
   */
  joinRoom(roomId: string, options?: IJoinRoomOpts): Promise<Room>;

  /**
   * Leave a room
   * @param roomId - The room id
   */
  leaveRoom(roomId: string): Promise<{}>;

  /**
   * Observable that emits room and state events.
   */
  eventsObservable(): Observable<RoomEvent | StateEvent>;

  /**
   * Observable that emits to device message events.
   */
  toDeviceMessagesObservable(): Observable<ToDeviceMessageEvent>;

  /**
   * Receives the state events of a give type from the current room if any
   * exists.
   *
   * @remarks While one can type the returned event using the generic parameter
   *          `T`, it is not recommended to rely on this type till further
   *          validation of the event structure is performed.
   *
   * @param eventType - The type of the event to receive.
   * @param options - Options for receiving the state event.
   *                  Use `stateKey` to receive events with a specifc state
   *                  key.
   *                  Use `roomIds` to receive the state events from other
   *                  rooms.
   *                  Pass `Symbols.AnyRoom` to receive from all rooms of the
   *                  user.
   */
  receiveStateEvents<T>(
    eventType: string,
    options: {
      stateKey?: string;
      roomIds: string[] | Symbols.AnyRoom;
    },
  ): Promise<Array<StateEvent<T>>>;

  /**
   * Get the power level event of the room.
   *
   * @param roomId - The room id to get the power level event from.
   */
  getPowerLevelEvent(
    roomId: string,
  ): Promise<StateEvent<PowerLevelsStateEvent> | undefined>;

  /**
   * Get the room create event.
   *
   * @param roomId - The room id to get the room create event from.
   */
  getRoomCreateEvent(
    roomId: string,
  ): Promise<StateEvent<StateEventCreateContent> | undefined>;

  /**
   * Send a state event with a given type to the room
   * @param eventType - The type of the event to send.
   * @param stateKey - State key.
   * @param content - The content of the event.
   * @param roomId - The room id
   * @returns event id
   */
  sendStateEvent(
    eventType: string,
    stateKey: string,
    content: unknown,
    roomId: string,
  ): Promise<string>;

  /**
   * Send a delayed state event with a given type to the room
   * @param eventType - The type of the event to send.
   * @param stateKey - State key.
   * @param content - The content of the event.
   * @param roomId - The room id
   * @param delay - The delay in ms
   * @returns delay id
   */
  sendDelayedStateEvent(
    eventType: string,
    stateKey: string,
    content: unknown,
    roomId: string,
    delay: number,
  ): Promise<string>;

  /**
   * Receives the state events of a give type from the current room if any
   * exists.
   *
   * @remarks While one can type the returned event using the generic parameter
   *          `T`, it is not recommended to rely on this type till further
   *          validation of the event structure is performed.
   *
   * @param eventType - The type of the event to receive.
   * @param options - Options for receiving the state event.
   *                  Use `stateKey` to receive events with a specifc state
   *                  key.
   *                  Use `roomIds` to receive the state events from other
   *                  rooms.
   *                  Pass `Symbols.AnyRoom` to receive from all rooms of the
   *                  user.
   */
  receiveRoomEvents<T>(
    eventType: string,
    options: {
      messageType?: string;
      roomIds: string[] | Symbols.AnyRoom;
    },
  ): Promise<Array<RoomEvent<T>>>;

  /**
   * Sends a room event with a given type to the room.
   * @param eventType - The event type.
   * @param content -The event content.
   * @param roomId - The room id
   * @returns event id
   */
  sendRoomEvent(
    eventType: string,
    content: unknown,
    roomId: string,
  ): Promise<string>;

  /**
   * Sends a delayed room event with a given type to the room.
   * @param eventType - The event type.
   * @param content -The event content.
   * @param roomId - The room id
   * @param delay - The delay in ms
   * @returns delay id
   */
  sendDelayedRoomEvent(
    eventType: string,
    content: unknown,
    roomId: string,
    delay: number,
  ): Promise<string>;

  /**
   * Update a delayed event by delay id
   * @param delayId - The delay id of the event
   * @param action - The action to update
   */
  updateDelayedEvent(
    delayId: string,
    action: UpdateDelayedEventAction,
  ): Promise<void>;

  /**
   * Receive all events that relate to a given `eventId` by means of MSC2674.
   * `chunk` can include state events or room events.
   *
   * @remarks You can only receive events where the capability to receive it was
   *          approved. If an event in `chunk` is not approved, it is silently
   *          skipped. Note that the call might return less than `limit` events
   *          due to various reasons, including missing capabilities or encrypted
   *          events.
   *
   * @param eventId - The id of the event to receive
   * @param options - Options for receiving the related events.
   *                  Use `roomId` to receive the event from another room.
   *                  Use `limit` to control the page size.
   *                  Use `from` to request the next page of events by providing
   *                  `nextToken` of a previous call. If `nextToken === undefined`,
   *                  no further page exists.
   *                  Use `relationType` to only return events with that `rel_type`.
   *                  Use `eventType` to only return events with that `type`.
   *                  Use `direction` to change time-order of the chunks
   *                  (default: 'b').
   *
   * @throws if the capability to receive the type of event is missing.
   */
  readEventRelations(
    eventId: string,
    options: {
      roomId: string;
      limit?: number;
      from?: string;
      relationType?: string;
      eventType?: string;
      direction?: 'f' | 'b';
    },
  ): Promise<{
    chunk: Array<RoomEvent | StateEvent>;
    nextToken?: string;
  }>;

  /**
   * Close a room: Send a tombstone event and kick all members.
   *
   * @param roomId - ID of the room to close
   */
  closeRoom(roomId: string): Promise<void>;
};
