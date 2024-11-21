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

import { Avatar, IconButton, useTheme } from '@mui/material';
import { isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { useAppSelector } from '../../store';
import { makeSelectInvites } from '../../store/api/selectors/selectInvites';
import { InvitesDialog } from './InvitesDialog';

export const InvitesMenu: React.FC = () => {
  const [invitesDialogOpen, setInvitesDialogOpen] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const { userId } = useLoggedIn();

  const selectInvites = useMemo(() => makeSelectInvites(userId), [userId]);
  const invites = useAppSelector((state) => selectInvites(state), isEqual);

  const handleCloseDialog = useCallback(() => setInvitesDialogOpen(false), []);
  const handleOpenDialog = useCallback(() => setInvitesDialogOpen(true), []);

  return (
    <>
      <InvitesDialog onClose={handleCloseDialog} open={invitesDialogOpen} />
      {invites.length > 0 && (
        <IconButton
          aria-label={t('invitesDialog.numberOfPendingInvites', {
            defaultValue_one: 'One pending invite',
            defaultValue: '{{count}} pending invites',
            count: invites.length,
          })}
          size="small"
          sx={{ ml: 'auto' }}
          onClick={handleOpenDialog}
        >
          <Avatar
            sx={{
              fontSize: '0.9em',
              bgcolor: theme.palette.primary.dark,
              width: 30,
              height: 30,
            }}
          >
            {invites.length > 99 ? '∞' : invites.length}
          </Avatar>
        </IconButton>
      )}
    </>
  );
};
