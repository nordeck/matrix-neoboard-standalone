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
