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

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { useNavigate } from 'react-router';
import { STATE_EVENT_SESSION } from '../../model';
import { useLoggedIn } from '../../state';
import { makeSelectWhiteboard, RootState } from '../../store';
import { DashboardContainer } from './DashboardContainer.tsx';
import { createWhiteboard } from './createWhiteboard.ts';
import { useDashboardList } from './useDashboardList.ts';
import { useDashboardView } from './useDashboardView.tsx';

export function Dashboard() {
  const { t } = useTranslation();
  const { standaloneClient } = useLoggedIn();
  const dashboardItems = useDashboardList();
  const DashboardView = useDashboardView();
  const navigate = useNavigate();
  const store = useStore<RootState>();

  const handleCreate = useCallback(async () => {
    // create room first
    const { room_id: roomId } = await standaloneClient.createRoom({
      name: t('dashboard.untitled', 'Untitled'),
      power_level_content_override: {
        events: {
          [STATE_EVENT_SESSION]: 0,
        },
      },
    });

    const selectWhiteboard = makeSelectWhiteboard(roomId);

    // Wait for the whiteboard state event to arrive in the store, with a
    // timeout so a network failure doesn't leave the UI hung indefinitely.
    let unsubscribe: (() => void) | undefined;
    const whiteboardReady = new Promise<void>((resolve, reject) => {
      // Check immediately in case the event already arrived
      if (selectWhiteboard(store.getState())) {
        resolve();
        return;
      }

      unsubscribe = store.subscribe(() => {
        if (selectWhiteboard(store.getState())) resolve();
      });

      setTimeout(
        () =>
          reject(
            new Error(t('dashboard.createTimeout', 'Board creation timed out')),
          ),
        30_000,
      );
    }).finally(() => unsubscribe?.());

    // create a whiteboard in the room
    await createWhiteboard(standaloneClient, roomId);

    await whiteboardReady;

    navigate(`/board/${roomId}`);
  }, [standaloneClient, t, navigate, store]);

  return (
    <DashboardContainer>
      <DashboardView items={dashboardItems} onCreate={handleCreate} />
    </DashboardContainer>
  );
}
