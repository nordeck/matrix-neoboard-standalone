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
  RoomEvent,
  StateEvent,
  ToDeviceMessageEvent,
  WidgetApi,
} from '@matrix-widget-toolkit/api';
import { ICreateRoomOpts, IJoinRoomOpts, Room } from 'matrix-js-sdk';
import { Symbols } from 'matrix-widget-api';
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
   * Warning: This returns an array of the events even if there is only one event.
   *
   * @param roomId - The room id to get the power level event from.
   */
  getPowerLevelEvent(roomId: string): Promise<PowerLevelsStateEvent[]>;

  /**
   * Send a state event with a given type to the room
   * @param eventType - The type of the event to send.
   * @param stateKey - State key.
   * @param content - The content of the event.
   * @param roomId - The room id
   */
  sendStateEvent(
    eventType: string,
    stateKey: string,
    content: unknown,
    roomId: string,
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
   */
  sendRoomEvent(
    eventType: string,
    content: unknown,
    roomId: string,
  ): Promise<string>;

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
