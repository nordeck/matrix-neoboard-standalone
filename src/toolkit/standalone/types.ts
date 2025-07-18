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

import {
  RoomEvent,
  StateEvent,
  ToDeviceMessageEvent,
  WidgetApi,
  WidgetParameters,
} from '@matrix-widget-toolkit/api';
import { Symbols, UpdateDelayedEventAction } from 'matrix-widget-api';
import { Observable } from 'rxjs';
import { StandaloneClient } from './client';

/**
 * API needed to communicate to the homeserver from the standalone app.
 *
 * Similar to WidgetApi from the matrix widget toolkit, but provides only several methods
 * on top of standalone client and with explicit roomId(s) parameter.
 */
export type StandaloneApi = {
  /**
   * Provides access to standalone client.
   */
  readonly client: StandaloneClient;

  /**
   * Provide an observable that can be used to listen to state event updates of
   * a given type in the current room.
   * Initially, the current state event is emitted, if one exists.
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
  observeStateEvents<T>(
    eventType: string,
    options: {
      stateKey?: string;
      roomIds: string[] | Symbols.AnyRoom;
    },
  ): Observable<StateEvent<T>>;

  /**
   * Send a state event with a given type to the current room and wait till the
   * operation is completed.
   * @param eventType - The type of the event to send.
   * @param content - The content of the event.
   * @param options - Options for sending the state event.
   *                  Use `roomId` to send the state event to another room.
   *                  Use `stateKey` to send a state event with a custom state
   *                  key.
   */
  sendStateEvent<T>(
    eventType: string,
    content: T,
    { roomId, stateKey }: { roomId: string; stateKey?: string },
  ): Promise<StateEvent<T>>;

  /**
   * Send a delayed state event with a given type to the current room.
   * @param eventType - The type of the event to send.
   * @param content - The content of the event.
   * @param delay - The delay of the event in milliseconds.
   * @param options - Options for sending the state event.
   *                  Use `roomId` to send the state event to another room.
   *                  Use `stateKey` to send a state event with a custom state
   *                  key.
   * @returns The result data of delayed event with delay_id.
   */
  sendDelayedStateEvent<T>(
    eventType: string,
    content: T,
    delay: number,
    options: { roomId: string; stateKey?: string },
  ): Promise<{ delay_id: string }>;

  /**
   * Provide an observable that can be used to listen to room event updates of
   * a given type in the current room.
   * Initially, the previous room events are emitted.
   *
   * @remarks While one can type the returned event using the generic parameter
   *          `T`, it is not recommended to rely on this type till further
   *          validation of the event structure is performed.
   *
   * @param eventType - The type of the event to receive.
   * @param options - Options for receiving the room event.
   *                  Use `messageType` to receive events with a specific
   *                  message type.
   *                  Use `roomIds` to receive the state events from other
   *                  rooms.
   *                  Pass `Symbols.AnyRoom` to receive from all rooms of the
   *                  user.
   */
  observeRoomEvents<T>(
    eventType: string,
    {
      messageType,
      roomIds,
    }: { messageType?: string; roomIds: string[] | Symbols.AnyRoom },
  ): Observable<RoomEvent<T>>;

  /**
   * Send a room event with a given type to the current room and wait till the
   * operation is completed.
   * @param eventType - The type of the event to send.
   * @param content - The content of the event.
   * @param options - Options for sending the room event.
   *                  Use `roomId` to send the room event to another room.
   */
  sendRoomEvent<T>(
    eventType: string,
    content: T,
    { roomId }: { roomId: string },
  ): Promise<RoomEvent<T>>;

  /**
   * Send a delayed room event with a given type to the current room.
   * @param eventType - The type of the event to send.
   * @param content - The content of the event.
   * @param delay - The delay of the event in milliseconds.
   * @param options - Options for sending the state event.
   *                  Use `roomId` to send the state event to another room.
   *                  Use `stateKey` to send a state event with a custom state
   *                  key.
   * @returns The result data of delayed event with delay_id.
   */
  sendDelayedRoomEvent<T>(
    eventType: string,
    content: T,
    delay: number,
    options: { roomId: string },
  ): Promise<{ delay_id: string }>;

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
   * Observes all to device messages send to the current device.
   *
   * @param eventType - The type of the event.
   */
  observeToDeviceMessages<T>(
    eventType: string,
  ): Observable<ToDeviceMessageEvent<T>>;
};

/**
 * Extends WidgetApi for the widget that runs in a standalone mode.
 */
export type StandaloneWidgetApi = WidgetApi & {
  /**
   * Overrides widget parameters
   * @param widgetParameters - widget parameters
   */
  overrideWidgetParameters(widgetParameters: Partial<WidgetParameters>): void;
};
