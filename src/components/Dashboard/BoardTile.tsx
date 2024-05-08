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
import { t } from 'i18next';
import { MouseEvent, useMemo } from 'react';
import { WhiteboardEntry } from '../../store/api/selectors/selectWhiteboards';

type BoardTileProps = {
  onClick: () => void;
  previewUrl: string;
  whiteboard: WhiteboardEntry;
};

export function BoardTile({ onClick, previewUrl, whiteboard }: BoardTileProps) {
  const lastView = useMemo(() => getRandomInt(12), []);
  return (
    <Card sx={{ width: '232px' }}>
      <CardActionArea onClick={onClick}>
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
            {whiteboard.roomName}
          </Typography>
          <Typography color="text.secondary">
            {t(
              'dashboard.boardTile.lastView',
              'Last view {{lastView}} hours ago',
              { lastView },
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={noop}>
            <PeopleAltIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

function getRandomInt(max: number) {
  return 1 + Math.floor(Math.random() * max);
}

const noop = function (event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
};
