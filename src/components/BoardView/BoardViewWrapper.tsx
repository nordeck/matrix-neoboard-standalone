/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { isEqual } from 'lodash';
import { useMemo } from 'react';
import { useLoggedIn } from '../../state';
import {
  makeSelectWhiteboards,
  selectSortBy,
  useAppSelector,
} from '../../store';
import { useOpenedRoomId } from '../RoomIdProvider';
import { BoardNotFound } from './BoardNotFound';
import { BoardView } from './BoardView';

export const BoardViewWrapper = () => {
  const roomId = useOpenedRoomId();
  const { userId } = useLoggedIn();
  const sortBy = useAppSelector((state) => selectSortBy(state));
  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId, sortBy),
    [sortBy, userId],
  );

  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  const whiteboardEvent = whiteboards.find(
    (w) => w.whiteboard.room_id === roomId,
  );

  return whiteboardEvent ? <BoardView /> : <BoardNotFound />;
};
