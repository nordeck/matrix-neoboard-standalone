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
