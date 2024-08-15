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

import { BoardTile } from './BoardTile.tsx';
import { CreateBoardTile } from './CreateBoardTile.tsx';
import { DashboardOptions } from './DashboardOptions.tsx';
import { TilesContainer } from './TilesContainer.tsx';
import boardPreview1 from './board1.png';
import boardPreview2 from './board2.png';
import boardPreview3 from './board3.png';
import boardPreview4 from './board4.png';
import boardPreview5 from './board5.png';
import type { DashboardViewProps } from './useDashboardView.tsx';

/**
 * Static images. To be replaced when implementing thumbnails.
 */
const boardPreviews = [
  boardPreview1,
  boardPreview2,
  boardPreview3,
  boardPreview4,
  boardPreview5,
];

export function DashboardTileView({
  items,
  onCreate,
  onSelect,
}: DashboardViewProps) {
  return (
    <>
      <DashboardOptions />
      <TilesContainer>
        <CreateBoardTile onClick={onCreate} />
        {items.map((dashboardItem, index) => (
          <BoardTile
            key={dashboardItem.roomId}
            dashboardItem={dashboardItem}
            previewUrl={boardPreviews[index % 5]}
            onClick={() => onSelect(dashboardItem)}
          />
        ))}
      </TilesContainer>
    </>
  );
}
