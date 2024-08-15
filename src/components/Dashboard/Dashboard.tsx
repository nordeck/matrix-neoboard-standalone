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

import { useLoggedIn } from '../../state';
import { DashboardContainer } from './DashboardContainer.tsx';
import { createWhiteboard } from './createWhiteboard.ts';
import { DashboardItem, useDashboardList } from './useDashboardList.ts';
import { useDashboardView } from './useDashboardView.tsx';

type DashboardProps = {
  setSelectedRoomId: (roomId: string) => void;
};

export function Dashboard({ setSelectedRoomId }: DashboardProps) {
  const { standaloneClient } = useLoggedIn();
  const dashboardItems = useDashboardList();
  const DashboardView = useDashboardView();

  return (
    <DashboardContainer>
      <DashboardView
        items={dashboardItems}
        onCreate={async () => {
          const roomId = await createWhiteboard(standaloneClient, 'Untitled');
          setSelectedRoomId(roomId);
        }}
        onSelect={(dashboardItem: DashboardItem) => {
          const roomId = dashboardItem.roomId;
          setSelectedRoomId(roomId);
        }}
      />
    </DashboardContainer>
  );
}
