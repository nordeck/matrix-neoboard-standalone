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

import { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { roomMemberApi } from './api/roomMemberApi';
import { roomNameApi } from './api/roomNameApi';
import { whiteboardApi } from './api/whiteboardApi';
import { AppDispatch } from './store';

export async function initializeApi(dispatch: AppDispatch): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actions: QueryActionCreatorResult<any>[] = [];

  actions.push(dispatch(roomNameApi.endpoints.getAllRoomNameEvents.initiate()));
  actions.push(dispatch(whiteboardApi.endpoints.getWhiteboardsAll.initiate()));
  actions.push(dispatch(roomMemberApi.endpoints.getRoomMembersAll.initiate()));

  // wait for initial load
  await Promise.all(actions.map((a) => a.unwrap()));
}
