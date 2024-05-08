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
