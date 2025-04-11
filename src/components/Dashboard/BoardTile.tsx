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
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { MouseEvent } from 'react';
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
    <Card sx={{ textDecoration: 'none', width: '14.5rem' }}>
      <CardActionArea component={Link} to={linkTarget}>
        <CardMedia component="div">
          <Thumbnail aria-hidden="true">
            <BoardPreview whiteboard={dashboardItem.whiteboard} />
          </Thumbnail>
        </CardMedia>
        <CardContent>
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
          <Typography color="text.secondary">
            {t('dashboard.boardTile.lastView', 'Last view {{lastView}}', {
              lastView: dashboardItem.lastView,
            })}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={noop} component="span">
            <PeopleAltIcon />
          </IconButton>
          {hasTileMenu && <TileMenu item={dashboardItem} />}
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

function noop(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
}
