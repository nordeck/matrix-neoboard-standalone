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

import { Stack, styled } from '@mui/material';
import { BoardListItem } from './BoardListItem.tsx';
import { CreateBoardButton } from './CreateBoardButton.tsx';
import { DashboardListHeader } from './DashboardListHeader.tsx';
import { DashboardOptions } from './DashboardOptions.tsx';
import type { DashboardViewProps } from './useDashboardView.tsx';

const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  th: {
    textAlign: 'left',
    padding: theme.spacing(2, 3),
  },
  'tbody tr:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function DashboardListView({ items, onCreate }: DashboardViewProps) {
  return (
    <>
      <Stack direction="row" alignItems="center">
        <CreateBoardButton onClick={onCreate} />
        <DashboardOptions sx={{ marginLeft: 'auto' }} />
      </Stack>
      <StyledTable>
        <thead>
          <DashboardListHeader />
        </thead>
        <tbody>
          {items.map((dashboardItem) => (
            <BoardListItem
              key={dashboardItem.roomId}
              dashboardItem={dashboardItem}
            />
          ))}
        </tbody>
      </StyledTable>
    </>
  );
}
