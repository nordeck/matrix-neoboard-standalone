// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { BoardTile } from './BoardTile.tsx';
import { CreateBoardTile } from './CreateBoardTile.tsx';
import { DashboardOptions } from './DashboardOptions.tsx';
import { TilesContainer } from './TilesContainer.tsx';
import type { DashboardViewProps } from './useDashboardView.tsx';

export function DashboardTileView({ items, onCreate }: DashboardViewProps) {
  return (
    <>
      <DashboardOptions />
      <TilesContainer>
        <CreateBoardTile onClick={onCreate} />
        {items.map((dashboardItem) => (
          <BoardTile
            key={dashboardItem.roomId}
            dashboardItem={dashboardItem}
            linkTarget={`/board/${dashboardItem.roomId}`}
          />
        ))}
      </TilesContainer>
    </>
  );
}
