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

import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import {
  Button,
  Container,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { InviteEntry } from '../../store/api/selectors/selectInvites';

const BoardInviteContainer = styled(Container)({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '15vh',
  textAlign: 'center',
});

type BoardInviteProps = {
  invite: InviteEntry;
};

export const BoardInvite: React.FC<BoardInviteProps> = ({ invite }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { standaloneClient } = useLoggedIn();

  const [error, setError] = useState(false);
  const [hasPendingAction, setHasPendingAction] = useState(false);

  const roomName = invite.roomName ?? t('dashboard.untitled', 'Untitled');
  const inviter = invite.senderDisplayName ?? invite.senderUserId;

  const handleAcceptInvite = useCallback(async () => {
    setHasPendingAction(true);
    setError(false);
    try {
      await standaloneClient.joinRoom(invite.roomId);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setHasPendingAction(false);
    }
  }, [invite.roomId, standaloneClient]);

  const handleRejectInvite = useCallback(async () => {
    setHasPendingAction(true);
    setError(false);
    try {
      await standaloneClient.leaveRoom(invite.roomId);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setHasPendingAction(false);
    }
  }, [invite.roomId, standaloneClient]);

  return (
    <BoardInviteContainer>
      <MarkEmailUnreadIcon
        style={{ color: theme.palette.text.secondary, fontSize: 128 }}
      />
      <Typography
        variant="h1"
        color="textSecondary"
        sx={{ marginBottom: 2, marginTop: 2 }}
      >
        {t('boardInvite.title', 'You have been invited to this board')}
      </Typography>
      <Typography variant="h4" sx={{ marginBottom: 1 }}>
        {roomName}
      </Typography>
      <Typography color="textSecondary" sx={{ marginBottom: 3 }}>
        {t('boardInvite.invitedBy', 'Invited by {{name}}', { name: inviter })}
      </Typography>
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {t('boardInvite.actionFailed', 'Action failed')}
        </Typography>
      )}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={hasPendingAction}
          onClick={handleAcceptInvite}
        >
          {t('invitesDialog.accept', 'Accept invite')}
        </Button>
        <Button
          variant="outlined"
          disabled={hasPendingAction}
          onClick={handleRejectInvite}
        >
          {t('invitesDialog.reject', 'Reject invite')}
        </Button>
      </Stack>
    </BoardInviteContainer>
  );
};
