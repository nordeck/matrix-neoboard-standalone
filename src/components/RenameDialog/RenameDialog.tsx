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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { unstable_useId as useId } from '@mui/utils';
import { STATE_EVENT_ROOM_NAME } from '@nordeck/matrix-neoboard-react-sdk';
import React, {
  FocusEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { DashboardItem } from '../Dashboard/useDashboardList';

type RenameDialogProps = {
  item: DashboardItem;
  onClose: () => void;
  open: boolean;
};

export const RenameDialog: React.FC<RenameDialogProps> = function ({
  item,
  onClose,
  open,
}) {
  const { t } = useTranslation();
  const [formName, setFormName] = useState(item.name);
  const { standaloneClient } = useLoggedIn();
  const dialogTitleId = useId();
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedName = formName.trim();

      if (trimmedName === '') {
        // Empty name - do nothing
        return;
      }

      if (trimmedName === item.name.trim()) {
        // No change - close dialog
        onClose();
        return;
      }

      try {
        await standaloneClient.sendStateEvent(
          STATE_EVENT_ROOM_NAME,
          '',
          {
            name: trimmedName,
          },
          item.roomId,
        );
      } catch (error) {
        console.error('Error setting room name', error);
        return;
      }

      onClose();
    },
    [formName, item, onClose, standaloneClient],
  );
  const stopPropagation = useCallback((e: FocusEvent | MouseEvent) => {
    // Stop propagating events from the dialog
    e.stopPropagation();
  }, []);

  return (
    <Dialog
      aria-labelledby={dialogTitleId}
      disableRestoreFocus
      open={open}
      onClose={onClose}
      onClick={stopPropagation}
      onFocus={stopPropagation}
      maxWidth="sm"
      fullWidth
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
    >
      <DialogTitle id={dialogTitleId}>
        {t('renameDialog.title', 'Rename board')}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label={t('renameDialog.name', 'Name')}
          type="text"
          fullWidth
          variant="standard"
          value={formName}
          onChange={(e) => setFormName(e.currentTarget.value)}
          inputProps={{ maxLength: 50 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('app.cancel', 'Cancel')}
        </Button>
        <Button variant="contained" type="submit">
          {t('renameDialog.rename', 'Rename')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
