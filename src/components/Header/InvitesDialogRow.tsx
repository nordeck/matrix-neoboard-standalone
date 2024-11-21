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
