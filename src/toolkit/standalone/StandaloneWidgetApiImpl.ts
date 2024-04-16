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
  TurnServer,
  WidgetConfig,
  WidgetParameters,
} from '@matrix-widget-toolkit/api';
import {
  IGetMediaConfigActionFromWidgetResponseData,
  IModalWidgetCreateData,
  IModalWidgetOpenRequestDataButton,
  IModalWidgetReturnData,
  IOpenIDCredentials,
  IUploadFileActionFromWidgetResponseData,
  IWidgetApiRequestData,
  ModalButtonID,
  Symbols,
  WidgetEventCapability,
} from 'matrix-widget-api';
import { Observable } from 'rxjs';
import { StandaloneApi, StandaloneWidgetApi } from './types';

/**
 * Implements WidgetApi from matrix widget toolkit using standalone API.
 * Implementation for some methods like capabilities negotiation is trivial.
 * Some methods like for popup control are not implemented.
 */
export class StandaloneWidgetApiImpl implements StandaloneWidgetApi {
  constructor(
    private readonly standaloneApi: StandaloneApi,
    public readonly widgetId: string,
    public readonly widgetParameters: WidgetParameters,
  ) {}

  overrideWidgetParameters(widgetParameters: Partial<WidgetParameters>): void {
    // @ts-ignore should have an option to override params when room changes
    this.widgetParameters = { ...this.widgetParameters, ...widgetParameters };
  }

  getWidgetConfig<T extends IWidgetApiRequestData>(): Readonly<
    WidgetConfig<T> | undefined
  > {
    throw new Error('getWidgetConfig not implemented');
  }

  rerequestInitialCapabilities(): Promise<void> {
    return Promise.resolve();
  }

  hasInitialCapabilities(): boolean {
    return true;
  }

  requestCapabilities(
    capabilities: (string | WidgetEventCapability)[],
  ): Promise<void> {
    return Promise.resolve();
  }

  hasCapabilities(capabilities: (string | WidgetEventCapability)[]): boolean {
    return true;
  }

  /** {@inheritDoc WidgetApi.receiveSingleStateEvent} */
  async receiveSingleStateEvent<T>(
    eventType: string,
    stateKey = '',
  ): Promise<StateEvent<T> | undefined> {
    const currentRoomId = this.widgetParameters.roomId;

    if (!currentRoomId) {
      throw new Error('Current room id is unknown');
    }

    const roomIds = [currentRoomId];

    const events = await this.standaloneApi.client.receiveStateEvents<T>(
      eventType,
      {
        stateKey,
        roomIds,
      },
    );
    return events && events[0];
  }

  /** {@inheritDoc WidgetApi.receiveStateEvents} */
  async receiveStateEvents<T>(
    eventType: string,
    {
      stateKey,
      roomIds,
    }: { stateKey?: string; roomIds?: string[] | Symbols.AnyRoom } = {},
  ): Promise<StateEvent<T>[]> {
    const targetRoomIds = this.targetRoomIds(roomIds);
    return await this.standaloneApi.client.receiveStateEvents(eventType, {
      stateKey,
      roomIds: targetRoomIds,
    });
  }

  /** {@inheritDoc WidgetApi.observeStateEvents} */
  observeStateEvents<T>(
    eventType: string,
    {
      stateKey,
      roomIds,
    }: { stateKey?: string; roomIds?: string[] | Symbols.AnyRoom } = {},
  ): Observable<StateEvent<T>> {
    const targetRoomIds = this.targetRoomIds(roomIds);
    return this.standaloneApi.observeStateEvents(eventType, {
      stateKey,
      roomIds: targetRoomIds,
    });
  }

  /** {@inheritDoc WidgetApi.sendStateEvent} */
  async sendStateEvent<T>(
    eventType: string,
    content: T,
    { roomId, stateKey = '' }: { roomId?: string; stateKey?: string } = {},
  ): Promise<StateEvent<T>> {
    const targetRoomId = this.targetRoomId(roomId);
    return await this.standaloneApi.sendStateEvent(eventType, content, {
      roomId: targetRoomId,
      stateKey,
    });
  }

  /** {@inheritDoc WidgetApi.receiveRoomEvents} */
  async receiveRoomEvents<T>(
    eventType: string,
    {
      messageType,
      roomIds,
    }: { messageType?: string; roomIds?: string[] | Symbols.AnyRoom } = {},
  ): Promise<Array<RoomEvent<T>>> {
    const targetRoomIds = this.targetRoomIds(roomIds);
    return await this.standaloneApi.client.receiveRoomEvents(eventType, {
      messageType,
      roomIds: targetRoomIds,
    });
  }

  /** {@inheritDoc WidgetApi.observeRoomEvents} */
  observeRoomEvents<T>(
    eventType: string,
    {
      messageType,
      roomIds,
    }: { messageType?: string; roomIds?: string[] | Symbols.AnyRoom } = {},
  ): Observable<RoomEvent<T>> {
    const targetRoomIds = this.targetRoomIds(roomIds);
    return this.standaloneApi.observeRoomEvents(eventType, {
      messageType,
      roomIds: targetRoomIds,
    });
  }

  /** {@inheritDoc WidgetApi.sendRoomEvent} */
  async sendRoomEvent<T>(
    eventType: string,
    content: T,
    { roomId }: { roomId?: string } = {},
  ): Promise<RoomEvent<T>> {
    const targetRoomId = this.targetRoomId(roomId);
    return await this.standaloneApi.sendRoomEvent(eventType, content, {
      roomId: targetRoomId,
    });
  }

  /** {@inheritDoc WidgetApi.readEventRelations} */
  async readEventRelations(
    eventId: string,
    options?: {
      roomId?: string;
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
    const targetRoomId = this.targetRoomId(options?.roomId);
    return await this.standaloneApi.client.readEventRelations(eventId, {
      roomId: targetRoomId,
      limit: options?.limit,
      from: options?.from,
      relationType: options?.relationType,
      eventType: options?.eventType,
      direction: options?.direction,
    });
  }

  /** {@inheritdoc WidgetApi.searchUserDirectory}  */
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
    return await this.standaloneApi.client.searchUserDirectory(
      searchTerm,
      options,
    );
  }

  /** {@inheritdoc WidgetApi.getMediaConfig}  */
  async getMediaConfig(): Promise<IGetMediaConfigActionFromWidgetResponseData> {
    return await this.standaloneApi.client.getMediaConfig();
  }

  /** {@inheritdoc WidgetApi.uploadFile}  */
  async uploadFile(
    // eslint complains about lib dom types
    // eslint-disable-next-line
    file: XMLHttpRequestBodyInit,
  ): Promise<IUploadFileActionFromWidgetResponseData> {
    return await this.standaloneApi.client.uploadFile(file);
  }

  /** {@inheritDoc WidgetApi.sendToDeviceMessage} */
  async sendToDeviceMessage<T>(
    eventType: string,
    encrypted: boolean,
    content: { [userId: string]: { [deviceId: string | '*']: T } },
  ): Promise<void> {
    return await this.standaloneApi.client.sendToDeviceMessage(
      eventType,
      encrypted,
      content,
    );
  }

  /** {@inheritDoc WidgetApi.observeToDeviceMessages} */
  observeToDeviceMessages<T>(
    eventType: string,
  ): Observable<ToDeviceMessageEvent<T>> {
    return this.standaloneApi.observeToDeviceMessages(eventType);
  }

  /** {@inheritDoc WidgetApi.openModal} */
  async openModal<
    T extends Record<string, unknown> = Record<string, unknown>,
    U extends IModalWidgetCreateData = IModalWidgetCreateData,
  >(
    pathName: string,
    name: string,
    options?: {
      buttons?: IModalWidgetOpenRequestDataButton[];
      data?: U;
    },
  ): Promise<T | undefined> {
    throw new Error('openModal not implemented');
  }

  /** {@inheritDoc WidgetApi.setModalButtonEnabled} */
  async setModalButtonEnabled(
    buttonId: ModalButtonID,
    isEnabled: boolean,
  ): Promise<void> {
    throw new Error('setModalButtonEnabled not implemented');
  }

  /** {@inheritDoc WidgetApi.observeModalButtons} */
  observeModalButtons(): Observable<ModalButtonID> {
    throw new Error('observeModalButtons not implemented');
  }

  /** {@inheritDoc WidgetApi.closeModal} */
  async closeModal<T extends IModalWidgetReturnData>(data?: T): Promise<void> {
    throw new Error('closeModal not implemented');
  }

  /** {@inheritdoc WidgetApi.navigateTo} */
  async navigateTo(uri: string): Promise<void> {
    throw new Error('navigateTo not implemented');
  }

  /** {@inheritdoc WidgetApi.requestOpenIDConnectToken} */
  async requestOpenIDConnectToken(): Promise<IOpenIDCredentials> {
    throw new Error('requestOpenIDConnectToken not implemented');
  }

  /** {@inheritdoc WidgetApi.observeTurnServers} */
  observeTurnServers(): Observable<TurnServer> {
    return this.standaloneApi.client.observeTurnServers();
  }

  private targetRoomId(roomId?: string): string {
    let targetRoomId: string;

    if (!roomId) {
      const currentRoomId = this.widgetParameters.roomId;

      if (!currentRoomId) {
        throw new Error('Current room id is unknown');
      }

      targetRoomId = currentRoomId;
    } else {
      targetRoomId = roomId;
    }

    return targetRoomId;
  }

  private targetRoomIds(
    roomIds?: string[] | Symbols.AnyRoom,
  ): string[] | Symbols.AnyRoom {
    let targetRoomIds: string[] | Symbols.AnyRoom;

    if (!roomIds) {
      const currentRoomId = this.widgetParameters.roomId;

      if (!currentRoomId) {
        throw new Error('Current room id is unknown');
      }

      targetRoomIds = [currentRoomId];
    } else {
      targetRoomIds = roomIds;
    }

    return targetRoomIds;
  }
}
