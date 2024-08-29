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
import { TileMenu } from './TileMenu';
import { BoardItemProps } from './useDashboardView.tsx';

export function BoardTile({
  onClick,
  previewUrl,
  dashboardItem,
}: BoardItemProps) {
  const { t } = useTranslation();

  const hasTileMenu =
    dashboardItem.permissions.canChangeName ||
    dashboardItem.permissions.canSendTombstone;

  return (
    <Card sx={{ width: '14.5rem' }}>
      <CardActionArea component="div" onClick={onClick}>
        <CardMedia component="img" height="120" image={previewUrl} />
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
