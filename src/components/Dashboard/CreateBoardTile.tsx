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

import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { t } from 'i18next';
import { AddIcon } from './AddIcon';

export const CreateBoardTile = ({ onClick }: { onClick: () => void }) => {
  return (
    <Card
      sx={{ width: '232px', minHeight: '264px', backgroundColor: '#FCE2CF' }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <AddIcon sx={{ fontSize: 30 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            mt={1}
          >
            {t('dashboard.createBoardTile.createBoard', 'Create a New Board')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
