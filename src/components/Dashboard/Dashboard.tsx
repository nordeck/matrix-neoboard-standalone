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

    // create a promise that will be resolved when whiteboard data is in store
    let promiseResolve: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      promiseResolve = resolve;
    });

    const selectWhiteboard = makeSelectWhiteboard(roomId);
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();

      const whiteboard = selectWhiteboard(state);
      if (whiteboard) {
        promiseResolve(undefined);
      }
    });

    // create a whiteboard in the room
    await createWhiteboard(standaloneClient, roomId);

    await promise;
    unsubscribe();

    navigate(`/board/${roomId}`);
  }, [standaloneClient, t, navigate, store]);

  return (
    <DashboardContainer>
      <DashboardView items={dashboardItems} onCreate={handleCreate} />
    </DashboardContainer>
  );
}
