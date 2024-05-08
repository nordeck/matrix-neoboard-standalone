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

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { unstable_useId as useId } from '@mui/utils';
import { t } from 'i18next';
import { useCallback } from 'react';
import {
  matrixCredentialsStorageKey,
  oidcCredentialsStorageKey,
} from '../../state/Credentials';
import { useApplication } from '../../state/useApplication';

type ExportDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function LogoutDialog({ open, onClose }: ExportDialogProps) {
  const application = useApplication();
  const dialogTitleId = useId();

  const handleConfirm = useCallback(() => {
    // This should be replaced by proper lifecycle functions or something similar
    application.destroy();
    localStorage.removeItem(oidcCredentialsStorageKey);
    localStorage.removeItem(matrixCredentialsStorageKey);
    application.start();
  }, [application]);

  return (
    <Dialog
      aria-labelledby={dialogTitleId}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={dialogTitleId}>
        {t('logOutDialog.title', 'Are you sure you want to log out?')}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('app.cancel', 'cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          autoFocus
        >
          {t('logOutDialog.logOut', 'Log out')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
