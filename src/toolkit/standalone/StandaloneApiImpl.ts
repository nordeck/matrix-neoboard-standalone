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
} from '@matrix-widget-toolkit/api';
import { Symbols } from 'matrix-widget-api';
import {
  Observable,
  ReplaySubject,
  concat,
  filter,
  firstValueFrom,
  from,
  map,
  mergeAll,
  share,
} from 'rxjs';
import { StandaloneClient } from './client';
import { StandaloneApi } from './types';
import { isDefined, isInRoom } from './utils';

/**
 * Implements standalone API.
 */
export class StandaloneApiImpl implements StandaloneApi {
  private readonly events$: Observable<RoomEvent | StateEvent>;
  private readonly toDeviceMessages$: Observable<ToDeviceMessageEvent>;

  constructor(public readonly client: StandaloneClient) {
    this.events$ = this.client.eventsObservable().pipe(share());
    this.toDeviceMessages$ = this.client
      .toDeviceMessagesObservable()
      .pipe(share());
  }

  observeStateEvents<T>(
    eventType: string,
    {
      stateKey,
      roomIds,
    }: { stateKey?: string; roomIds: string[] | Symbols.AnyRoom },
  ): Observable<StateEvent<T>> {
    const historyEvent$ = from(
      this.client.receiveStateEvents<T>(eventType, { stateKey, roomIds }),
    ).pipe(mergeAll());

    const futureEvent$ = this.events$.pipe(
      map((matrixEvent) => {
        if (
          matrixEvent.type === eventType &&
          'state_key' in matrixEvent &&
          matrixEvent.state_key !== undefined &&
          (stateKey === undefined || matrixEvent.state_key === stateKey) &&
          isInRoom(matrixEvent, roomIds)
        ) {
          return matrixEvent as StateEvent<T>;
        }

        return undefined;
      }),
      filter(isDefined),
    );

    return concat(historyEvent$, futureEvent$);
  }

  async sendStateEvent<T>(
    eventType: string,
    content: T,
    { roomId, stateKey = '' }: { roomId: string; stateKey?: string },
  ): Promise<StateEvent<T>> {
    const subject = new ReplaySubject<RoomEvent | StateEvent>();
    const subscription = this.events$.subscribe((e) => subject.next(e));

    try {
      const event_id = await this.client.sendStateEvent(
        eventType,
        stateKey,
        content,
        roomId,
      );
      // TODO: Why do we even return the event, not just the event id, we never
      // need it.
      const event = await firstValueFrom(
        subject.pipe(
          filter((matrixEvent) => {
            return (
              matrixEvent.event_id === event_id &&
              matrixEvent.room_id === roomId
            );
          }),
          map((event) => event as StateEvent<T>),
        ),
      );
      return event;
    } finally {
      subscription.unsubscribe();
    }
  }

  observeRoomEvents<T>(
    eventType: string,
    {
      messageType,
      roomIds,
    }: { messageType?: string; roomIds: string[] | Symbols.AnyRoom },
  ): Observable<RoomEvent<T>> {
    const historyEvent$ = from(
      this.client.receiveRoomEvents<T>(eventType, { messageType, roomIds }),
    ).pipe(mergeAll());

    const futureEvent$ = this.events$.pipe(
      map((event) => {
        const matrixEvent = event as
          | RoomEvent<{ msgtype?: string }>
          | StateEvent;

        if (
          matrixEvent.type === eventType &&
          !('state_key' in matrixEvent) &&
          (!messageType || matrixEvent.content.msgtype === messageType) &&
          isInRoom(matrixEvent, roomIds)
        ) {
          return event as RoomEvent<T>;
        }

        return undefined;
      }),
      filter(isDefined),
    );

    return concat(historyEvent$, futureEvent$);
  }

  async sendRoomEvent<T>(
    eventType: string,
    content: T,
    { roomId }: { roomId: string },
  ): Promise<RoomEvent<T>> {
    const subject = new ReplaySubject<RoomEvent | StateEvent>();
    const subscription = this.events$.subscribe((e) => subject.next(e));

    try {
      const event_id = await this.client.sendRoomEvent(
        eventType,
        content,
        roomId,
      );
      // TODO: Why do we even return the event, not just the event id, we never
      // need it.
      const event = await firstValueFrom(
        subject.pipe(
          filter((matrixEvent) => {
            return (
              matrixEvent.event_id === event_id &&
              matrixEvent.room_id === roomId
            );
          }),
          map((event) => event as RoomEvent<T>),
        ),
      );
      return event;
    } finally {
      subscription.unsubscribe();
    }
  }

  observeToDeviceMessages<T>(
    eventType: string,
  ): Observable<ToDeviceMessageEvent<T>> {
    return this.toDeviceMessages$.pipe(
      map((e) => e as ToDeviceMessageEvent<T>),
      filter((e) => e.type === eventType),
    );
  }
}
