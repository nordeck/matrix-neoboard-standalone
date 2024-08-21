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

import { Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AddIcon } from './AddIcon';
import { CreateBoardItemProps } from './useDashboardView.tsx';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.card,
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '1rem',
  '.MuiButton-startIcon > :nth-of-type(1)': {
    fontSize: 30,
    margin: theme.spacing(0, 1),
  },
}));

export const CreateBoardButton = ({ onClick }: CreateBoardItemProps) => {
  const { t } = useTranslation();
  return (
    <StyledButton size="large" onClick={onClick} startIcon={<AddIcon />}>
      {t('dashboard.createBoardTile.createBoard', 'Create a new board')}
    </StyledButton>
  );
};
