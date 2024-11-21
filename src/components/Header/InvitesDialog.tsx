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
