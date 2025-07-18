/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { isEqual } from 'lodash';
import { useMemo } from 'react';
import { makeSelectWhiteboard, useAppSelector } from '../../store';
import { useOpenedRoomId } from '../RoomIdProvider';
import { BoardNotFound } from './BoardNotFound';
import { BoardView } from './BoardView';

export const BoardViewWrapper = () => {
  const roomId = useOpenedRoomId();
  const selectWhiteboard = useMemo(
    () => makeSelectWhiteboard(roomId),
    [roomId],
  );

  const whiteboard = useAppSelector(
    (state) => selectWhiteboard(state),
    isEqual,
  );

  return whiteboard ? <BoardView /> : <BoardNotFound />;
};
