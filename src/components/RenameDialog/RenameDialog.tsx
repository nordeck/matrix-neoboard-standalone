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
  useEffect,
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
  const [isInitialOpen, setIsInitialOpen] = useState(true);
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

  useEffect(() => {
    if (open) {
      setFormName(item.name); // Reset to the original name
      setIsInitialOpen(true); // Reset the flag to select the text
    }
  }, [open, item.name]);

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
          inputRef={(input) => {
            if (input) {
              // Ensure it only focuses and selects the first time the dialog opens
              if (isInitialOpen) {
                input.focus();
                input.select();
                setIsInitialOpen(false); // Clear the flag after the first focus
              }
            }
          }}
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
