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

import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  styled,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAsyncFn } from 'react-use';
import { AddIcon } from './AddIcon';
import { CreateBoardItemProps } from './useDashboardView.tsx';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '14.5rem',
  minHeight: '251px',
  backgroundColor: theme.palette.background.card,
}));

export const CreateBoardTile = ({ onClick }: CreateBoardItemProps) => {
  const { t } = useTranslation();
  const [createState, handleCreate] = useAsyncFn(onClick, [onClick]);

  return (
    <StyledCard>
      <CardActionArea
        disabled={createState.loading}
        onClick={handleCreate}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          {createState.loading ? (
            <CircularProgress />
          ) : (
            <>
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
                {t(
                  'dashboard.createBoardTile.createBoard',
                  'Create a new board',
                )}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};
