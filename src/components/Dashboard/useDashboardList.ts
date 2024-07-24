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
