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

import { LoadingButton } from '@mui/lab';
import { Icon, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAsyncFn } from 'react-use';
import { AddIcon } from './AddIcon';
import { CreateBoardItemProps } from './useDashboardView.tsx';

const StyledButton = styled(LoadingButton)(({ theme }) => ({
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
  const [createState, handleCreate] = useAsyncFn(onClick, [onClick]);
  return (
    <StyledButton
      disabled={createState.loading}
      size="large"
      onClick={handleCreate}
      startIcon={createState.loading ? <Icon /> : <AddIcon />}
      loading={createState.loading}
    >
      {t('dashboard.createBoardTile.createBoard', 'Create a new board')}
    </StyledButton>
  );
};
