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

import Notifications from '@mui/icons-material/Notifications';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { useAppSelector } from '../../store';
import { makeSelectInvites } from '../../store/api/selectors/selectInvites';
import { InvitesDialog } from './InvitesDialog';

export const InvitesMenu: React.FC = () => {
  const [invitesDialogOpen, setInvitesDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { userId } = useLoggedIn();

  const selectInvites = useMemo(() => makeSelectInvites(userId), [userId]);
  const invites = useAppSelector((state) => selectInvites(state), isEqual);

  const handleCloseDialog = useCallback(() => setInvitesDialogOpen(false), []);
  const handleOpenDialog = useCallback(() => {
    if (invites.length > 0) {
      setInvitesDialogOpen(true);
    }
  }, [invites.length]);

  const tooltipTitle = t('invitesDialog.numberOfPendingInvites', {
    defaultValue_zero: 'No pending invites',
    defaultValue_one: 'One pending invite',
    defaultValue: '{{count}} pending invites',
    count: invites.length,
  });

  return (
    <>
      <InvitesDialog onClose={handleCloseDialog} open={invitesDialogOpen} />
      <Tooltip title={tooltipTitle}>
        <IconButton
          aria-label={tooltipTitle}
          onClick={handleOpenDialog}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: 40,
          }}
        >
          <Badge
            badgeContent={invites.length > 99 ? '∞' : invites.length}
            color="primary"
          >
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>
    </>
  );
};
