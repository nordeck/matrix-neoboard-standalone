/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

import { People } from '@mui/icons-material';
import {
  IconButton,
  Tooltip,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MembersDialog } from './MembersDialog';

export function MembersMenu({ roomId }: { roomId: string | undefined }) {
  const { t } = useTranslation();
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const handleCloseDialog = useCallback(() => setMembersDialogOpen(false), []);
  const handleOpenDialog = useCallback(() => {
    setMembersDialogOpen(true);
  }, []);


  if (!roomId) {
    return null;
  }

  return (
    <>
      <MembersDialog roomId={roomId} onClose={handleCloseDialog} open={membersDialogOpen} />
      <Tooltip title={t('membersMenu.members', 'Members')}>
        <IconButton
          onClick={handleOpenDialog}
          size="small"
          aria-label={t('membersMenu.members', 'Members')}
          aria-haspopup="true"
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: 40,
          }}
        >
          <People sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Tooltip>
    </>
  );
}
