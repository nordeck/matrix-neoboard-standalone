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

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { unstable_useId as useId } from '@mui/utils';
import { t } from 'i18next';
import { FocusEvent, MouseEvent, useCallback } from 'react';

type ExportDialogProps = {
  confirmActionLabel: string;
  /**
   * If true, shows a loading button as confirm button and disables cancel the dialog.
   * {@link https://mui.com/material-ui/react-button/#loading-button}
   */
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  open: boolean;
  title: string;
  text?: string;
  textColor?: 'error';
};

export function ConfirmDialog({
  confirmActionLabel,
  onClose,
  onConfirm,
  loading,
  open,
  text,
  textColor,
  title,
}: ExportDialogProps) {
  const dialogTitleId = useId();

  const stopPropagation = useCallback((e: FocusEvent | MouseEvent) => {
    // Stop propagating events from the dialog
    e.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    if (loading) {
      // Do not close loading dialogs
      return;
    }

    onClose();
  }, [loading, onClose]);

  return (
    <Dialog
      aria-labelledby={dialogTitleId}
      open={open}
      onClick={stopPropagation}
      onClose={handleClose}
      onFocus={stopPropagation}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={dialogTitleId}>{title}</DialogTitle>

      {text !== 'undefined' && (
        <DialogContent>
          <DialogContentText color={textColor}>{text}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <Button disabled={loading} onClick={handleClose} variant="outlined">
          {t('app.cancel', 'Cancel')}
        </Button>
        <LoadingButton
          loading={loading}
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
        >
          {confirmActionLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
