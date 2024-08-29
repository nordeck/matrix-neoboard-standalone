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

import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useLoggedIn } from '../../state';
import { ConfirmDialog } from '../ConfirmDialog';

export const useDeleteDialog = function (roomId: string) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { standaloneClient } = useLoggedIn();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    await standaloneClient.closeRoom(roomId);
    setLoading(false);
    setOpen(false);
  }, [roomId, standaloneClient]);

  return {
    deleteDialog: (
      <ConfirmDialog
        confirmActionLabel={t('deleteDialog.delete', 'Delete Board')}
        loading={loading}
        onClose={handleClose}
        onConfirm={handleDelete}
        open={open}
        text={t(
          'deleteDialog.text',
          'Do you really want to delete the board? This cannot be undone.',
        )}
        textColor="error"
        title={t('deleteDialog.title', 'Delete NeoBoard')}
      />
    ),
    setDeleteDialogOpen: setOpen,
  };
};
