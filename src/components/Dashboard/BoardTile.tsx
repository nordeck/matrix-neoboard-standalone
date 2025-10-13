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

import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BoardPreview } from './BoardPreview';
import { Thumbnail } from './Thumbnail';
import { TileMenu } from './TileMenu';
import { DashboardItem } from './useDashboardList';

type BoardTileProps = {
  dashboardItem: DashboardItem;
  linkTarget: string;
};

export function BoardTile({ dashboardItem, linkTarget }: BoardTileProps) {
  const { t } = useTranslation();

  const hasTileMenu =
    dashboardItem.permissions.canChangeName ||
    dashboardItem.permissions.canSendTombstone;

  return (
    <Card sx={{ textDecoration: 'none', width: '20.5rem' }}>
      <CardActionArea component={Link} to={linkTarget}>
        <CardMedia component="div">
          <Thumbnail aria-hidden="true">
            <BoardPreview whiteboard={dashboardItem.whiteboard} />
          </Thumbnail>
        </CardMedia>
        <Box sx={{ display: 'flex', justifyContent: 'stretch' }}>
          <CardContent sx={{ minWidth: 0, flex: 'auto' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {dashboardItem.name}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t('dashboard.boardTile.lastView', 'Last view {{lastView}}', {
                lastView: dashboardItem.lastView,
              })}
            </Typography>
          </CardContent>
          <CardActions>
            {hasTileMenu && <TileMenu item={dashboardItem} />}
          </CardActions>
        </Box>
      </CardActionArea>
    </Card>
  );
}
