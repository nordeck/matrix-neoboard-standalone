// SPDX-License-Identifier: AGPL-3.0-or-later

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

import { Dialog, DialogContent, DialogTitle, List } from '@mui/material';
import { isEqual } from 'lodash';
import { useEffect, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { useAppSelector } from '../../store';
import { makeSelectInvites } from '../../store/api/selectors/selectInvites';
import { InvitesDialogRow } from './InvitesDialogRow';

type InvitesDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const InvitesDialog: React.FC<InvitesDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();

  const { userId } = useLoggedIn();

  const selectInvites = useMemo(() => makeSelectInvites(userId), [userId]);
  const invites = useAppSelector((state) => selectInvites(state), isEqual);

  // Auto-close the dialog, if no invites are left
  useEffect(() => {
    if (invites.length === 0) {
      onClose();
    }
  }, [invites, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>
        {t('invitesDialog.title', 'Invites')}
      </DialogTitle>
      <DialogContent style={{ whiteSpace: 'pre-wrap' }} id={descriptionId}>
        <List>
          {invites.map((invite) => (
            <InvitesDialogRow key={invite.roomId} invite={invite} />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
