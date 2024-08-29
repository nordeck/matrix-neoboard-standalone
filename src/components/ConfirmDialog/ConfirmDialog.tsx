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
