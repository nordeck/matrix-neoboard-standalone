// SPDX-License-Identifier: AGPL-3.0-or-later

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

import { alpha, Stack, styled, Typography, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BoardPreview } from './BoardPreview.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import { TileMenu } from './TileMenu';
import { DashboardItem } from './useDashboardList.ts';
import { BoardItemProps } from './useDashboardView.tsx';

const BoardTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',
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

export function BoardListItem({ dashboardItem }: BoardItemProps) {
  const { t } = useTranslation();

  return (
    <ClickableRow tabIndex={0} role="button">
      <td style={{ width: 0 }}>
        <UnstyledLink dashboardItem={dashboardItem}>
          <Thumbnail
            aria-hidden="true"
            divider={false}
            style={{ width: '10rem' }}
          >
            <BoardPreview whiteboard={dashboardItem.whiteboard} />
          </Thumbnail>
        </UnstyledLink>
      </td>
      <td>
        <UnstyledLink dashboardItem={dashboardItem}>
          <Stack direction="row" alignItems="center" gap={1}>
            <BoardTitle variant="h4" component="div">
              {dashboardItem.name}
            </BoardTitle>
            {dashboardItem.permissions.canChangeName && (
              <TileMenu item={dashboardItem} />
            )}
          </Stack>
        </UnstyledLink>
      </td>
      <td>
        <UnstyledLink dashboardItem={dashboardItem}>
          <Typography color="textSecondary" sx={{ fontSize: 13 }}>
            {t('dashboard.boardTile.lastView', 'Last view {{lastView}}', {
              lastView: dashboardItem.lastView,
            })}
          </Typography>
        </UnstyledLink>
      </td>
      <td>
        <UnstyledLink dashboardItem={dashboardItem}>
          <Typography color="textSecondary" sx={{ fontSize: 13 }}>
            {t('dashboard.boardTile.created', 'Created {{created}}', {
              created: dashboardItem.created,
            })}
          </Typography>
        </UnstyledLink>
      </td>
    </ClickableRow>
  );
}

function UnstyledLink({
  children,
  dashboardItem,
}: PropsWithChildren<{ dashboardItem: DashboardItem }>) {
  const theme = useTheme();

  return (
    <Link
      key={dashboardItem.roomId}
      to={`/board/${dashboardItem.roomId}`}
      style={{
        alignItems: 'center',
        color: 'inherit',
        display: 'flex',
        // @todo This is not great of course, but required for the links to work.
        // We should switch the list to a CSS grid view instead.
        height: '122px',
        padding: theme.spacing(2, 3),
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}
