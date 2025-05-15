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
            height: 40,
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
