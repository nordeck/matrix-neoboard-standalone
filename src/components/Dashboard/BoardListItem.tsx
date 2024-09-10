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

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { alpha, IconButton, Stack, styled, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BoardPreview } from './BoardPreview.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import { TileMenu } from './TileMenu';
import { BoardItemProps } from './useDashboardView.tsx';
import { UserChip } from './UserChip.tsx';

const BoardTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
})) as typeof Typography;

const ClickableRow = styled('tr')(({ theme }) => ({
  cursor: 'pointer',
  td: {
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  '&:hover td': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

export function BoardListItem({ onClick, dashboardItem }: BoardItemProps) {
  const { t } = useTranslation();

  return (
    <ClickableRow tabIndex={0} role="button" onClick={onClick}>
      <td style={{ width: 0 }}>
        <Thumbnail
          aria-hidden="true"
          divider={false}
          style={{ width: '10rem' }}
        >
          <BoardPreview preview={dashboardItem.preview} />
        </Thumbnail>
      </td>
      <td>
        <Stack direction="row" alignItems="center" gap={1}>
          <BoardTitle variant="h4" component="div">
            {dashboardItem.name}
          </BoardTitle>
          {dashboardItem.permissions.canChangeName && (
            <TileMenu item={dashboardItem} />
          )}
        </Stack>
      </td>
      <td>
        <Stack direction="row" alignItems="center" gap={1}>
          <Stack direction="column">
            {dashboardItem.users?.map((user) => (
              <UserChip key={user} user={user} onClick={noop} />
            ))}
          </Stack>
          <IconButton onClick={noop} component="span">
            <PeopleAltIcon />
          </IconButton>
        </Stack>
      </td>
      <td>
        <Typography color="textSecondary" sx={{ fontSize: 13 }}>
          {t('dashboard.boardTile.lastView', 'Last view {{lastView}}', {
            lastView: dashboardItem.lastView,
          })}
        </Typography>
      </td>
      <td>
        <Typography color="textSecondary" sx={{ fontSize: 13 }}>
          {t('dashboard.boardTile.created', 'Created {{created}}', {
            created: dashboardItem.created,
          })}
        </Typography>
      </td>
    </ClickableRow>
  );
}

function noop(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
}
