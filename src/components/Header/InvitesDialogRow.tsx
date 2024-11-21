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

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ListItem, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { InviteEntry } from '../../store/api/selectors/selectInvites';

type InvitesDialogRowProps = {
  invite: InviteEntry;
};

export const InvitesDialogRow: React.FC<InvitesDialogRowProps> = ({
  invite,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [hasPendingAction, setHasPendingAction] = useState(false);
  const [success, setSuccess] = useState(false);

  const { standaloneClient } = useLoggedIn();

  const handleAcceptInvite = async () => {
    setHasPendingAction(true);
    try {
      await standaloneClient.joinRoom(invite.roomId);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setHasPendingAction(false);
    }
  };

  const handleRejectInvite = async () => {
    setHasPendingAction(true);
    try {
      await standaloneClient.leaveRoom(invite.roomId);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setHasPendingAction(false);
    }
  };

  if (success) {
    return;
  }

  return (
    <ListItem
      secondaryAction={
        <IconButton
          aria-label={t('invitesDialog.reject', 'Reject invite')}
          disabled={hasPendingAction}
          edge="end"
          onClick={handleRejectInvite}
        >
          <CloseIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {invite.roomName ?? invite.roomId}
          </Typography>
        }
        secondary={
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {invite.senderDisplayName ?? invite.senderUserId}
          </Typography>
        }
      />
      {error && (
        <Typography color="red">
          {t('invitesDialog.actionFailed', 'Action failed')}
        </Typography>
      )}
      <IconButton
        aria-label={t('invitesDialog.accept', 'Accept invite')}
        disabled={hasPendingAction}
        onClick={handleAcceptInvite}
      >
        <CheckIcon />
      </IconButton>
    </ListItem>
  );
};
