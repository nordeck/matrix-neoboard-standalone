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
  RoomEvent,
  StateEvent,
  ToDeviceMessageEvent,
} from '@matrix-widget-toolkit/api';
import { Symbols, UpdateDelayedEventAction } from 'matrix-widget-api';
import { firstValueFrom, of, take, toArray } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { StandaloneApiImpl } from './StandaloneApiImpl';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from './client/mockStandaloneClient';
import { StandaloneApi } from './types';

describe('StandaloneApiImpl', () => {
  let standaloneClient: MockedStandaloneClient;
  let standaloneApi: StandaloneApi;

  beforeEach(() => {
    standaloneClient = mockStandaloneClient();
  });

  describe('observeStateEvents', () => {
    it('should receive updates about state events from any room', async () => {
      standaloneClient.receiveStateEvents.mockResolvedValue([
        mockStateEvent({
          content: { hello: 'world' },
          state_key: '',
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockStateEvent({
            state_key: '',
            content: { 'how are you': 'world' },
          }),
          mockStateEvent({
            content: { hello: 'world from another room' },
            room_id: '!another-room',
            state_key: '',
          }),
          mockStateEvent({
            state_key: '',
            content: { bye: 'world' },
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeStateEvents('com.example.test', {
        roomIds: Symbols.AnyRoom,
      });

      const events = await firstValueFrom($events.pipe(take(4), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          state_key: '',
          content: { hello: 'world' },
        }),
        expect.objectContaining({
          type: 'com.example.test',
          state_key: '',
          content: { 'how are you': 'world' },
        }),
        mockStateEvent({
          content: { hello: 'world from another room' },
          room_id: '!another-room',
          state_key: '',
        }),
        expect.objectContaining({
          type: 'com.example.test',
          state_key: '',
          content: { bye: 'world' },
        }),
      ]);
      expect(standaloneClient.receiveStateEvents).toBeCalledWith(
        'com.example.test',
        {
          roomIds: Symbols.AnyRoom,
        },
      );
    });

    it('should receive updates about state events for a custom state key', async () => {
      standaloneClient.receiveStateEvents.mockResolvedValue([
        mockStateEvent({
          state_key: 'custom-state-key',
          content: { hello: 'world' },
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockStateEvent({
            state_key: 'custom-state-key-other',
            content: { bye: 'world' },
          }),
          mockStateEvent({
            state_key: 'custom-state-key',
            content: { 'how are you': 'world' },
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeStateEvents('com.example.test', {
        stateKey: 'custom-state-key',
        roomIds: Symbols.AnyRoom,
      });

      const events = await firstValueFrom($events.pipe(take(2), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          state_key: 'custom-state-key',
          content: { hello: 'world' },
        }),
        expect.objectContaining({
          type: 'com.example.test',
          state_key: 'custom-state-key',
          content: { 'how are you': 'world' },
        }),
      ]);
      expect(standaloneClient.receiveStateEvents).toBeCalledWith(
        'com.example.test',
        {
          stateKey: 'custom-state-key',
          roomIds: Symbols.AnyRoom,
        },
      );
    });

    it('should receive updates about state events for room ids', async () => {
      standaloneClient.receiveStateEvents.mockResolvedValue([
        mockStateEvent({
          content: { hello: 'world' },
          room_id: '!another-room',
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockStateEvent({
            content: { bye: 'world' },
            room_id: '!some-another-room',
          }),
          mockStateEvent({
            content: { 'how are you': 'world' },
            room_id: '!another-room',
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeStateEvents('com.example.test', {
        roomIds: ['!another-room'],
      });

      const events = await firstValueFrom($events.pipe(take(2), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          content: { hello: 'world' },
          room_id: '!another-room',
        }),
        expect.objectContaining({
          type: 'com.example.test',
          state_key: '',
          content: { 'how are you': 'world' },
          room_id: '!another-room',
        }),
      ]);
      expect(standaloneClient.receiveStateEvents).toBeCalledWith(
        'com.example.test',
        {
          roomIds: ['!another-room'],
        },
      );
    });

    it('should error observable if receiving fails', async () => {
      standaloneClient.receiveStateEvents.mockRejectedValue(
        new Error('Power to low'),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeStateEvents('com.example.test', {
        roomIds: Symbols.AnyRoom,
      });
      await expect(firstValueFrom($events)).rejects.toThrowError(
        'Power to low',
      );
    });
  });

  describe('sendStateEvent', () => {
    it('should send state event', async () => {
      const stateEvent = { hello: 'world' };

      standaloneClient.sendStateEvent.mockResolvedValue('$event-id');

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockStateEvent({
            content: stateEvent,
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendStateEvent('com.example.test', stateEvent, {
          roomId: '!current-room',
        }),
      ).resolves.toMatchObject({
        room_id: '!current-room',
        sender: '@my-user-id',
        state_key: '',
        type: 'com.example.test',
        content: stateEvent,
      });
      expect(standaloneClient.sendStateEvent).toBeCalled();
    });

    it('should send state event with custom state key', async () => {
      const stateEvent = { hello: 'world' };

      standaloneClient.sendStateEvent.mockResolvedValue('$event-id');

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockStateEvent({
            state_key: 'custom-state-key',
            content: stateEvent,
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendStateEvent('com.example.test', stateEvent, {
          roomId: '!current-room',
          stateKey: 'custom-state-key',
        }),
      ).resolves.toMatchObject({
        room_id: '!current-room',
        sender: '@my-user-id',
        state_key: 'custom-state-key',
        type: 'com.example.test',
        content: stateEvent,
      });
      expect(standaloneClient.sendStateEvent).toBeCalled();
    });

    it('should reject on error while sending', async () => {
      const stateEvent = { hello: 'world' };

      standaloneClient.sendStateEvent.mockRejectedValue(
        new Error('Power to low'),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendStateEvent('com.example.test', stateEvent, {
          roomId: '!current-room',
        }),
      ).rejects.toThrowError('Power to low');
      expect(standaloneClient.sendStateEvent).toBeCalled();
    });
  });

  describe('sendDelayedStateEvent', () => {
    it('should send delayed state event', async () => {
      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendDelayedStateEvent(
          'com.example.test',
          {
            key: 'value',
          },
          1000,
          {
            roomId: '!current-room',
          },
        ),
      ).resolves.toEqual({ delay_id: 'syd_bcooaGNyKtyFbIGjGMQR' });
    });
  });

  describe('observeRoomEvents', () => {
    it('should receive updates about room events from any room', async () => {
      standaloneClient.receiveRoomEvents.mockResolvedValue([
        mockRoomEvent({
          content: { hello: 'world' },
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockRoomEvent({
            content: { 'how are you': 'world' },
          }),
          mockRoomEvent({
            content: { hello: 'world from another room' },
            room_id: '!another-room',
          }),
          mockRoomEvent({
            state_key: '',
            content: { bye: 'world' },
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeRoomEvents('com.example.test', {
        roomIds: Symbols.AnyRoom,
      });

      const events = await firstValueFrom($events.pipe(take(4), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          content: { hello: 'world' },
        }),
        expect.objectContaining({
          type: 'com.example.test',
          content: { 'how are you': 'world' },
        }),
        mockRoomEvent({
          content: { hello: 'world from another room' },
          room_id: '!another-room',
        }),
        expect.objectContaining({
          type: 'com.example.test',
          content: { bye: 'world' },
        }),
      ]);
      expect(standaloneClient.receiveRoomEvents).toBeCalledWith(
        'com.example.test',
        {
          roomIds: Symbols.AnyRoom,
        },
      );
    });

    it('should receive updates about room events for a custom message type', async () => {
      standaloneClient.receiveRoomEvents.mockResolvedValue([
        mockRoomEvent({
          content: { hello: 'world', msgtype: 'my-message-type' },
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockRoomEvent({
            content: { bye: 'world', msgtype: 'my-message-type-other' },
          }),
          mockRoomEvent({
            content: { 'how are you': 'world', msgtype: 'my-message-type' },
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeRoomEvents('com.example.test', {
        messageType: 'my-message-type',
        roomIds: Symbols.AnyRoom,
      });

      const events = await firstValueFrom($events.pipe(take(2), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          content: { hello: 'world', msgtype: 'my-message-type' },
        }),
        expect.objectContaining({
          type: 'com.example.test',
          content: { 'how are you': 'world', msgtype: 'my-message-type' },
        }),
      ]);
      expect(standaloneClient.receiveRoomEvents).toBeCalledWith(
        'com.example.test',
        {
          messageType: 'my-message-type',
          roomIds: Symbols.AnyRoom,
        },
      );
    });

    it('should receive updates about room events for room ids', async () => {
      standaloneClient.receiveRoomEvents.mockResolvedValue([
        mockRoomEvent({
          content: { hello: 'world' },
          room_id: '!another-room',
        }),
      ]);

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockRoomEvent({
            content: { bye: 'world' },
            room_id: '!some-another-room',
          }),
          mockRoomEvent({
            content: { 'how are you': 'world' },
            room_id: '!another-room',
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeRoomEvents('com.example.test', {
        roomIds: ['!another-room'],
      });

      const events = await firstValueFrom($events.pipe(take(2), toArray()));

      expect(events).toEqual([
        expect.objectContaining({
          type: 'com.example.test',
          content: { hello: 'world' },
          room_id: '!another-room',
        }),
        expect.objectContaining({
          type: 'com.example.test',
          content: { 'how are you': 'world' },
          room_id: '!another-room',
        }),
      ]);
      expect(standaloneClient.receiveRoomEvents).toBeCalledWith(
        'com.example.test',
        {
          roomIds: ['!another-room'],
        },
      );
    });

    it('should error observable if receiving fails', async () => {
      standaloneClient.receiveRoomEvents.mockRejectedValue(
        new Error('Power to low'),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeRoomEvents('com.example.test', {
        roomIds: Symbols.AnyRoom,
      });
      await expect(firstValueFrom($events)).rejects.toThrowError(
        'Power to low',
      );
    });
  });

  describe('sendRoomEvent', () => {
    it('should send room event', async () => {
      const roomEvent = { hello: 'world' };

      standaloneClient.sendRoomEvent.mockResolvedValue('$event-id');

      standaloneClient.eventsObservable.mockReturnValue(
        of(
          mockRoomEvent({
            content: roomEvent,
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendRoomEvent('com.example.test', roomEvent, {
          roomId: '!current-room',
        }),
      ).resolves.toMatchObject({
        room_id: '!current-room',
        sender: '@my-user-id',
        type: 'com.example.test',
        content: roomEvent,
      });
      expect(standaloneClient.sendRoomEvent).toBeCalled();
    });

    it('should reject on error while sending', async () => {
      const roomEvent = { hello: 'world' };

      standaloneClient.sendRoomEvent.mockRejectedValue(
        new Error('Power to low'),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendRoomEvent('com.example.test', roomEvent, {
          roomId: '!current-room',
        }),
      ).rejects.toThrowError('Power to low');
      expect(standaloneClient.sendRoomEvent).toBeCalled();
    });
  });

  describe('sendDelayedRoomEvent', () => {
    it('should send delayed room event', async () => {
      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.sendDelayedRoomEvent(
          'com.example.test',
          {
            key: 'value',
          },
          1000,
          {
            roomId: '!current-room',
          },
        ),
      ).resolves.toEqual({ delay_id: 'syd_wlGAStYmBRRdjnWiHSDA' });
    });
  });

  describe('updateDelayedEvent', () => {
    it('should update delayed event', async () => {
      standaloneApi = new StandaloneApiImpl(standaloneClient);

      await expect(
        standaloneApi.updateDelayedEvent(
          'syd_wlGAStYmBRRdjnWiHSDA',
          UpdateDelayedEventAction.Cancel,
        ),
      ).resolves.toBeUndefined();
    });
  });

  describe('observeToDeviceMessages', () => {
    it('should receive updates about to device messages', async () => {
      standaloneClient.toDeviceMessagesObservable.mockReturnValue(
        of(
          mockToDeviceMessage({
            content: { 'how are you': 'world' },
          }),
          mockToDeviceMessage({
            type: 'com.example.other',
            content: { not: 'displayed' },
          }),
          mockToDeviceMessage({
            content: { bye: 'world' },
          }),
        ),
      );

      standaloneApi = new StandaloneApiImpl(standaloneClient);

      const $events = standaloneApi.observeToDeviceMessages(
        'com.example.message',
      );
      const events = await firstValueFrom($events.pipe(take(2), toArray()));

      expect(events).toEqual([
        {
          type: 'com.example.message',
          content: { 'how are you': 'world' },
          sender: '@my-user-id',
          encrypted: false,
        },
        {
          type: 'com.example.message',
          content: { bye: 'world' },
          sender: '@my-user-id',
          encrypted: false,
        },
      ]);
    });
  });
});

function mockStateEvent<T>({
  content,
  type = 'com.example.test',
  room_id = '!current-room',
  state_key = '',
}: {
  content?: T;
  type?: string;
  room_id?: string;
  state_key?: string;
} = {}): StateEvent {
  return {
    content: content ?? {},
    room_id,
    type,
    state_key,
    event_id: '$event-id',
    origin_server_ts: 0,
    sender: '@my-user-id',
  };
}

function mockRoomEvent<T>({
  content,
  type = 'com.example.test',
  room_id = '!current-room',
}: {
  content?: T;
  type?: string;
  room_id?: string;
  state_key?: string;
} = {}): RoomEvent {
  return {
    content: content ?? {},
    room_id,
    type,
    event_id: '$event-id',
    origin_server_ts: 0,
    sender: '@my-user-id',
  };
}

function mockToDeviceMessage<T>({
  content,
  type = 'com.example.message',
  encrypted = false,
}: {
  content?: T;
  type?: string;
  encrypted?: boolean;
} = {}): ToDeviceMessageEvent {
  return {
    content: content ?? {},
    type,
    sender: '@my-user-id',
    encrypted,
  };
}
