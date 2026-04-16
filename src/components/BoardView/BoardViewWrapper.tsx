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
import { useLoggedIn } from '../../state';
import {
  makeSelectInvites,
  makeSelectWhiteboard,
  useAppSelector,
} from '../../store';
import { useOpenedRoomId } from '../RoomIdProvider';
import { BoardInvite } from './BoardInvite';
import { BoardNoAccess } from './BoardNoAccess.tsx';
import { BoardNotFound } from './BoardNotFound';
import { BoardView } from './BoardView';
import { useDeclinedInvite } from './useDeclinedInvite.ts';

export const BoardViewWrapper = () => {
  const roomId = useOpenedRoomId();
  const { userId } = useLoggedIn();
  const selectInvites = useMemo(() => makeSelectInvites(userId), [userId]);
  const selectWhiteboard = useMemo(
    () => makeSelectWhiteboard(roomId),
    [roomId],
  );
  const invite = useAppSelector(
    (state) => selectInvites(state)?.find((entry) => entry.roomId === roomId),
    isEqual,
  );
  const whiteboard = useAppSelector(
    (state) => selectWhiteboard(state),
    isEqual,
  );

  const declined = useDeclinedInvite(userId, roomId);

  // ✅ The order here is intentional and important:
  // 1. A new invite always overrides a previous decline (users can be re-invited)
  // 2. Whiteboard access takes priority over declined state
  // 3. Declined is only shown when there's no active invite and no access

  if (invite) {
    return <BoardInvite invite={invite} />;
  }

  if (whiteboard) {
    return <BoardView />;
  }

  if (declined) {
    return <BoardNoAccess />;
  }

  return <BoardNotFound />;
};
