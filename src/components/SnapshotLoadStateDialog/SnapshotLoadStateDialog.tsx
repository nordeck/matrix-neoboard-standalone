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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnapshotLoadState } from '@nordeck/matrix-neoboard-react-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const SnapshotLoadStateDialog: React.FC = () => {
  const { t } = useTranslation();
  const { snapshotLoadDialogOpen } = useSnapshotLoadState();
  const navigate = useNavigate();

  if (!snapshotLoadDialogOpen) {
    return null;
  }

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <Dialog open={true} disableEscapeKeyDown={true}>
      <DialogTitle>
        {t('snapshotLoadState.dialog.title', 'Unable to display the board')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            'snapshotLoadState.dialog.text',
            'You will be able to see the contents when another user is working on the board.',
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleGoBack}>
          {t('snapshotLoadState.dialog.goBackButton.label', 'Go back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
