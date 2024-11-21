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
