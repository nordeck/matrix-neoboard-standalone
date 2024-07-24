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

import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { formatTimeAgo } from '../../lib';
import { useLoggedIn } from '../../state';
import {
  WhiteboardEntry,
  makeSelectWhiteboards,
  useAppSelector,
} from '../../store';

export type DashboardItem = {
  name: string;
  /**
   * Readable last view string, e.g. "3 hours ago"
   */
  lastView: string;
  /**
   * ID of the room, that contains the whiteboard
   */
  roomId: string;
};

/**
 * Returns a list of dashboard items, that can be used to easily render the tiles.
 */
export function useDashboardList(): DashboardItem[] {
  const { userId } = useLoggedIn();
  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId),
    [userId],
  );
  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);

  // Update every 30 seconds and on whiteboard object changes.
  // Keep the dashboard items up to date (e.g. last view).
  useEffect(() => {
    setDashboardItems(whiteboards.map(mapWhiteboardToDashboardItem));

    const intervalId = setInterval(() => {
      setDashboardItems(whiteboards.map(mapWhiteboardToDashboardItem));
    }, 30_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [whiteboards]);

  return dashboardItems;
}

function mapWhiteboardToDashboardItem(
  whiteboard: WhiteboardEntry,
): DashboardItem {
  return {
    roomId: whiteboard.whiteboard.room_id,
    name: whiteboard.roomName,
    lastView: formatLastView(whiteboard),
  };
}

function formatLastView(whiteboard: WhiteboardEntry): string {
  return whiteboard.whiteboardSessions?.origin_server_ts === undefined
    ? '-'
    : formatTimeAgo(whiteboard.whiteboardSessions.origin_server_ts);
}
