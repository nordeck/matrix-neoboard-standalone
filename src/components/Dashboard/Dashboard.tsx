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
import { useLoggedIn } from '../../state';
import { DashboardContainer } from './DashboardContainer.tsx';
import { createWhiteboard } from './createWhiteboard.ts';
import { DashboardItem, useDashboardList } from './useDashboardList.ts';
import { useDashboardView } from './useDashboardView.tsx';

type DashboardProps = {
  setSelectedRoomId: (roomId: string) => void;
};

export function Dashboard({ setSelectedRoomId }: DashboardProps) {
  const { t } = useTranslation();
  const { standaloneClient } = useLoggedIn();
  const dashboardItems = useDashboardList();
  const DashboardView = useDashboardView();

  return (
    <DashboardContainer>
      <DashboardView
        items={dashboardItems}
        onCreate={useCallback(async () => {
          const roomId = await createWhiteboard(
            standaloneClient,
            t('dashboard.untitled', 'Untitled'),
          );
          setSelectedRoomId(roomId);
        }, [setSelectedRoomId, standaloneClient, t])}
        onSelect={useCallback(
          (dashboardItem: DashboardItem) => {
            const roomId = dashboardItem.roomId;
            setSelectedRoomId(roomId);
          },
          [setSelectedRoomId],
        )}
      />
    </DashboardContainer>
  );
}
