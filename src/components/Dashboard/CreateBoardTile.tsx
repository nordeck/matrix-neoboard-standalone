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

import {
  Card,
  CardActionArea,
  CardContent,
  styled,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AddIcon } from './AddIcon';
import { CreateBoardItemProps } from './useDashboardView.tsx';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '14.5rem',
  minHeight: '251px',
  backgroundColor: theme.palette.background.card,
}));

export const CreateBoardTile = ({ onClick }: CreateBoardItemProps) => {
  const { t } = useTranslation();

  return (
    <StyledCard>
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
            {t('dashboard.createBoardTile.createBoard', 'Create a new board')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};
