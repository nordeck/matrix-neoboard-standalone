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
  TurnServer,
} from '@matrix-widget-toolkit/api';
import {
  ClientEvent,
  Direction,
  EventTimeline,
  EventType,
  ITurnServer as IClientTurnServer,
  ICreateRoomOpts,
  MatrixClient,
  MatrixEvent,
  Room,
  StateEvents,
  TimelineEvents,
} from 'matrix-js-sdk';
import {
  IGetMediaConfigActionFromWidgetResponseData,
  IRoomEvent,
  ITurnServer,
  IUploadFileActionFromWidgetResponseData,
  Symbols,
} from 'matrix-widget-api';
import { Observable, from, fromEvent, map } from 'rxjs';
import { StandaloneClient } from './types';

/**
 * Implements a standalone client using MatrixClient from matrix-js-sdk.
 *
 * Methods implementations are basically copied and simplified from StopGapWidgetDriver of matrix-react-sdk.
 */
export class MatrixStandaloneClient implements StandaloneClient {
  private readonly events$: Observable<RoomEvent | StateEvent>;
  private readonly toDeviceMessages$: Observable<ToDeviceMessageEvent>;

  constructor(private readonly matrixClient: MatrixClient) {
    this.events$ = fromEvent(
      this.matrixClient,
      ClientEvent.Event,
      (event: MatrixEvent) => {
        return event.getEffectiveEvent() as RoomEvent | StateEvent;
      },
    );

    this.toDeviceMessages$ = fromEvent(
      this.matrixClient,
      ClientEvent.ToDeviceEvent,
      (event: MatrixEvent) => {
        return event.getEffectiveEvent() as unknown as ToDeviceMessageEvent;
      },
    );
  }

  async createRoom(options: ICreateRoomOpts): Promise<{ room_id: string }> {
    return await this.matrixClient.createRoom(options);
  }

  eventsObservable(): Observable<RoomEvent | StateEvent> {
    return this.events$;
  }

  toDeviceMessagesObservable(): Observable<ToDeviceMessageEvent> {
    return this.toDeviceMessages$;
  }

  receiveStateEvents<T>(
    eventType: string,
    {
      stateKey,
      roomIds,
    }: { stateKey?: string; roomIds: string[] | Symbols.AnyRoom },
  ): Promise<Array<StateEvent<T>>> {
    const rooms = this.pickRooms(roomIds);
    const events = findStateEvents(
      rooms,
      eventType,
      stateKey,
    ) as StateEvent<T>[];
    return Promise.resolve(events);
  }

  async sendStateEvent(
    eventType: string,
    stateKey: string,
    content: unknown,
    roomId: string,
  ): Promise<string> {
    const { event_id } = await this.matrixClient.sendStateEvent(
      roomId,
      eventType as keyof StateEvents,
      // bypass matrix-js-sdk typings here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content as any,
      stateKey,
    );
    return event_id;
  }

  receiveRoomEvents<T>(
    eventType: string,
    {
      messageType,
      roomIds,
    }: { messageType?: string; roomIds: string[] | Symbols.AnyRoom },
  ): Promise<Array<RoomEvent<T>>> {
    const rooms = this.pickRooms(roomIds);
    const events = findRoomEvents(
      rooms,
      eventType,
      messageType,
    ) as RoomEvent<T>[];
    return Promise.resolve(events);
  }

  async sendRoomEvent(
    eventType: string,
    content: unknown,
    roomId: string,
  ): Promise<string> {
    const { event_id } = await this.matrixClient.sendEvent(
      roomId,
      eventType as keyof TimelineEvents,
      // bypass matrix-js-sdk typings here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content as any,
    );
    return event_id;
  }

  async readEventRelations(
    eventId: string,
    {
      roomId,
      limit,
      from,
      relationType,
      eventType,
      direction,
    }: {
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
  }> {
    const dir = direction ? (direction as Direction) : undefined;

    const { events, nextBatch } = await this.matrixClient.relations(
      roomId,
      eventId,
      relationType ?? null,
      eventType ?? null,
      { from, to: undefined, limit, dir },
    );

    return {
      chunk: events.map((e) => e.getEffectiveEvent() as IRoomEvent),
      nextToken: nextBatch ?? undefined,
    };
  }

  async searchUserDirectory(
    searchTerm: string,
    options?: { limit?: number | undefined } | undefined,
  ): Promise<{
    results: Array<{
      userId: string;
      displayName?: string;
      avatarUrl?: string;
    }>;
  }> {
    const { results } = await this.matrixClient.searchUserDirectory({
      term: searchTerm,
      limit: options?.limit,
    });

    return {
      results: results.map((r) => ({
        userId: r.user_id,
        displayName: r.display_name,
        avatarUrl: r.avatar_url,
      })),
    };
  }

  async getMediaConfig(): Promise<IGetMediaConfigActionFromWidgetResponseData> {
    return await this.matrixClient.getMediaConfig();
  }

  async uploadFile(
    // eslint complains about lib dom types

    file: XMLHttpRequestBodyInit,
  ): Promise<IUploadFileActionFromWidgetResponseData> {
    const uploadResult = await this.matrixClient.uploadContent(file);
    return { content_uri: uploadResult.content_uri };
  }

  async sendToDeviceMessage<T>(
    eventType: string,
    encrypted: boolean,
    content: { [userId: string]: { [deviceId: string | '*']: T } },
  ): Promise<void> {
    if (encrypted) {
      throw new Error('Encryption in to device messages is not implemented');
    }

    const contentMap = content as {
      [userId: string]: { [deviceId: string]: object };
    };
    await this.matrixClient.queueToDevice({
      eventType,
      batch: Object.entries(contentMap).flatMap(([userId, userContentMap]) =>
        Object.entries(userContentMap).map(([deviceId, content]) => ({
          userId,
          deviceId,
          payload: content,
        })),
      ),
    });
  }

  observeTurnServers(): Observable<TurnServer> {
    return from(this.getTurnServers()).pipe(
      map(({ uris, username, password }) => ({
        urls: uris,
        username,
        credential: password,
      })),
    );
  }

  private pickRooms(roomIds: string[] | Symbols.AnyRoom): Room[] {
    let rooms: Room[];

    if (roomIds === Symbols.AnyRoom) {
      rooms = this.matrixClient.getVisibleRooms();
    } else {
      rooms = [];
      for (const roomId of roomIds) {
        const room = this.matrixClient.getRoom(roomId);
        if (!room) {
          throw new Error(`Room not found by id: ${roomId}`);
        }

        rooms.push(room);
      }
    }

    return rooms;
  }

  private async *getTurnServers(): AsyncGenerator<ITurnServer> {
    const client = this.matrixClient;
    if (!client.pollingTurnServers || !client.getTurnServers().length) return;

    let setTurnServer: (server: ITurnServer) => void;
    let setError: (error: Error) => void;

    const onTurnServers = ([server]: IClientTurnServer[]): void =>
      setTurnServer(normalizeTurnServer(server));
    const onTurnServersError = (error: Error, fatal: boolean): void => {
      if (fatal) setError(error);
    };

    client.on(ClientEvent.TurnServers, onTurnServers);
    client.on(ClientEvent.TurnServersError, onTurnServersError);

    try {
      const initialTurnServer = client.getTurnServers()[0];
      yield normalizeTurnServer(initialTurnServer);

      // Repeatedly listen for new TURN servers until an error occurs or
      // the caller stops this generator
      while (true) {
        yield await new Promise<ITurnServer>((resolve, reject) => {
          setTurnServer = resolve;
          setError = reject;
        });
      }
    } finally {
      // The loop was broken - clean up
      client.off(ClientEvent.TurnServers, onTurnServers);
      client.off(ClientEvent.TurnServersError, onTurnServersError);
    }
  }
}

function findStateEvents(
  rooms: Room[],
  eventType: string,
  stateKey?: string,
): StateEvent[] {
  const events: StateEvent[] = [];

  for (const room of rooms) {
    const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
    if (roomState) {
      if (stateKey === '' || !!stateKey) {
        const event = roomState.getStateEvents(eventType, stateKey);
        if (event) {
          events.push(event.getEffectiveEvent() as StateEvent);
        }
      } else {
        const roomEvents = roomState
          .getStateEvents(eventType)
          .map((e) => e.getEffectiveEvent() as StateEvent);
        events.push(...roomEvents);
      }
    }
  }

  return events;
}

function findRoomEvents(
  rooms: Room[],
  eventType: string,
  msgtype: string | undefined,
): RoomEvent[] {
  const events: RoomEvent[] = [];

  for (const room of rooms) {
    const events = room.getLiveTimeline().getEvents(); // timelines are most recent last
    for (let i = events.length - 1; i > 0; i--) {
      const ev = events[i];
      if (ev.getType() !== eventType || ev.isState()) continue;
      if (
        eventType === EventType.RoomMessage &&
        msgtype &&
        msgtype !== ev.getContent()['msgtype']
      )
        continue;
      events.push(ev);
    }
  }

  return events;
}

const normalizeTurnServer = ({
  urls,
  username,
  credential,
}: IClientTurnServer): ITurnServer => ({
  uris: urls,
  username,
  password: credential,
});
