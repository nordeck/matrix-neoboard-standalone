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

import { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { powerLevelsApi } from './api/PowerLevelsApi';
import { roomCreateApi } from './api/roomCreateApi';
import { roomMemberApi } from './api/roomMemberApi';
import { roomNameApi } from './api/roomNameApi';
import { whiteboardApi } from './api/whiteboardApi';
import { whiteboardSessionsApi } from './api/whiteboardSessionsApi';
import { AppDispatch } from './store';

export async function initializeApi(dispatch: AppDispatch): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actions: QueryActionCreatorResult<any>[] = [];

  actions.push(dispatch(roomNameApi.endpoints.getAllRoomNameEvents.initiate()));
  actions.push(
    dispatch(
      whiteboardSessionsApi.endpoints.getAllWhiteboardSessionsEvents.initiate(),
    ),
  );
  actions.push(dispatch(whiteboardApi.endpoints.getWhiteboardsAll.initiate()));
  actions.push(dispatch(roomMemberApi.endpoints.getRoomMembersAll.initiate()));
  actions.push(
    dispatch(powerLevelsApi.endpoints.getAllPowerLevelsEvents.initiate()),
  );
  actions.push(
    dispatch(roomCreateApi.endpoints.getAllRoomCreateEvents.initiate()),
  );

  // wait for initial load
  await Promise.all(actions.map((a) => a.unwrap()));
}
