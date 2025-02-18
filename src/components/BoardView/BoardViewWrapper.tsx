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
import { useNavigate } from 'react-router';
import { useLoggedIn } from '../../state';
import { useSelectedRoom } from '../../state/useSelectedRoom';
import {
  makeSelectWhiteboards,
  selectSortBy,
  useAppSelector,
} from '../../store';
import { BoardNotFound } from './BoardNotFound';
import { BoardView } from './BoardView';

export const BoardViewWrapper = () => {
  const { selectedRoomId } = useSelectedRoom();
  const { userId } = useLoggedIn();
  const sortBy = useAppSelector((state) => selectSortBy(state));
  const navigate = useNavigate();
  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId, sortBy),
    [sortBy, userId],
  );

  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  if (!selectedRoomId) {
    navigate('/dashboard');
  }

  const whiteboardEvent = whiteboards.find(
    (w) => w.whiteboard.room_id === selectedRoomId,
  );

  return whiteboardEvent ? <BoardView /> : <BoardNotFound />;
};
