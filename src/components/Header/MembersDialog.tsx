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

import { Dialog, DialogContent, DialogTitle, List } from '@mui/material';
import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MemberDialogRow } from './MembersDialogRow';
import { isEqual } from 'lodash';
import { useAppSelector } from '../../store';
import { makeSelectMembers } from '../../store/api/selectors/selectMembers';

type GenericDialogProps = {
  roomId: string;
  open: boolean;
  onClose: () => void;
};

export function MembersDialog({ roomId, open, onClose }: GenericDialogProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();

  const selectMembers = useMemo(() => makeSelectMembers(roomId), [roomId]);
  const members = useAppSelector((state) => selectMembers(state), isEqual);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>
        {t('membersDialog.title', 'Members')}
      </DialogTitle>
      <DialogContent style={{ whiteSpace: 'pre-wrap' }} id={descriptionId}>
        <List>
          {members.map((member) => (
            <MemberDialogRow key={member.userId} member={member} />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
