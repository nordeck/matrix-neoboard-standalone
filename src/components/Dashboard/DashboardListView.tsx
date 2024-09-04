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

import { Stack, styled } from '@mui/material';
import { BoardListItem } from './BoardListItem.tsx';
import { CreateBoardButton } from './CreateBoardButton.tsx';
import { DashboardListHeader } from './DashboardListHeader.tsx';
import { DashboardOptions } from './DashboardOptions.tsx';
import type { DashboardViewProps } from './useDashboardView.tsx';

const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  td: {
    padding: theme.spacing(2, 3),
  },
  th: {
    textAlign: 'left',
    padding: theme.spacing(2, 3),
  },
  'tbody tr:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function DashboardListView({
  items,
  onCreate,
  onSelect,
}: DashboardViewProps) {
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
              onClick={() => onSelect(dashboardItem)}
            />
          ))}
        </tbody>
      </StyledTable>
    </>
  );
}
