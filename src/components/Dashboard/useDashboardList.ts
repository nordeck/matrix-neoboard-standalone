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

import { StateEvent } from '@matrix-widget-toolkit/api';
import { Whiteboard } from '@nordeck/matrix-neoboard-react-sdk';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatTimeAgo } from '../../lib';
import {
  WhiteboardPermissions,
  calculateWhiteboardPermissions,
} from '../../lib/matrix';
import { calculateWhiteboardUserlist } from '../../lib/matrix/calculateWhiteboardUserlist.ts';
import { useLoggedIn } from '../../state';
import {
  WhiteboardEntry,
  makeSelectWhiteboards,
  selectSortBy,
  useAppSelector,
} from '../../store';

export type DashboardItem = {
  name: string;
  /**
   * Readable last view string, e.g. "3 hours ago"
   */
  lastView: string;
  /**
   * Readable created at string, e.g. "3 hours ago"
   */
  created: string;
  /**
   * ID of the room, that contains the whiteboard
   */
  roomId: string;
  permissions: WhiteboardPermissions;
  /**
   * SVG data of the board's first slide
   */
  preview: string;
  /**
   * List of user IDs or null if unavailable.
   */
  users: string[] | null;
  /**
   * Whiteboard state event
   */
  whiteboard: StateEvent<Whiteboard>;
};

/**
 * Returns a list of dashboard items, that can be used to easily render the tiles.
 */
export function useDashboardList(): DashboardItem[] {
  const { userId, deviceId } = useLoggedIn();
  const sortBy = useAppSelector((state) => selectSortBy(state));
  const selectWhiteboards = useMemo(
    () => makeSelectWhiteboards(userId, deviceId, sortBy),
    [sortBy, userId, deviceId],
  );
  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const mapFn = useCallback(
    (whiteboard: WhiteboardEntry) => {
      return mapWhiteboardToDashboardItem(whiteboard, userId);
    },
    [userId],
  );

  // Update every 30 seconds and on whiteboard object changes.
  // Keep the dashboard items up to date (e.g. last view).
  useEffect(() => {
    setDashboardItems(whiteboards.map(mapFn));

    const intervalId = setInterval(() => {
      setDashboardItems(whiteboards.map(mapFn));
    }, 30_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [mapFn, whiteboards]);

  return dashboardItems;
}

function mapWhiteboardToDashboardItem(
  whiteboard: WhiteboardEntry,
  userId: string,
): DashboardItem {
  return {
    roomId: whiteboard.whiteboard.room_id,
    name: whiteboard.roomName,
    lastView: formatLastView(whiteboard),
    created: formatCreated(whiteboard),
    permissions: calculateWhiteboardPermissions(whiteboard.powerLevels, userId),
    preview: whiteboard.preview ?? '',
    users: calculateWhiteboardUserlist(whiteboard.powerLevels),
    whiteboard: whiteboard.whiteboard,
  };
}

function formatLastView(whiteboard: WhiteboardEntry): string {
  return whiteboard.whiteboardSessions?.origin_server_ts === undefined
    ? '-'
    : formatTimeAgo(whiteboard.whiteboardSessions.origin_server_ts);
}

function formatCreated(whiteboard: WhiteboardEntry): string {
  return formatTimeAgo(whiteboard.whiteboard.origin_server_ts);
}
