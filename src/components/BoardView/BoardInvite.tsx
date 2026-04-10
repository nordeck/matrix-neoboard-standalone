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

import { ElementAvatar } from '@matrix-widget-toolkit/mui';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import {
  Button,
  Chip,
  Container,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { useUserDetails } from '@nordeck/matrix-neoboard-react-sdk';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLoggedIn } from '../../state';
import { InviteEntry } from '../../store';
import { ConfirmDialog } from '../ConfirmDialog';

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
  const navigate = useNavigate();
  const { standaloneClient, userId } = useLoggedIn();
  const [open, setOpen] = React.useState(false);
  const roomName = invite.roomName ?? t('dashboard.untitled', 'Untitled');
  const { getUserAvatarUrl } = useUserDetails();
  const avatarUrl = getUserAvatarUrl(invite.senderUserId);

  const handleAcceptInvite = useCallback(async () => {
    try {
      await standaloneClient.joinRoom(invite.roomId);
      if (userId) {
        const key = `neoboard:declinedInvites:${userId}`;
        const stored = localStorage.getItem(key);
        const declinedRooms: string[] = stored ? JSON.parse(stored) : [];

        const updated = declinedRooms.filter(
          (id: string) => id !== invite.roomId,
        );
        if (updated.length > 0) {
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [invite.roomId, standaloneClient, userId]);

  const handleRejectInvite = useCallback(async () => {
    try {
      await standaloneClient.leaveRoom(invite.roomId);
      if (userId) {
        const key = `neoboard:declinedInvites:${userId}`;
        const raw = localStorage.getItem(key);
        const list: string[] = raw ? JSON.parse(raw) : [];

        if (!list.includes(invite.roomId)) {
          list.push(invite.roomId);
          localStorage.setItem(key, JSON.stringify(list));
        }
      }
    } catch (err) {
      console.error(err);
    }

    navigate('/dashboard', { state: { inviteDeclined: true }, replace: true });
  }, [invite.roomId, standaloneClient, userId, navigate]);

  const handleRejectClick = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onclose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      <BoardInviteContainer>
        <MarkEmailUnreadIcon
          style={{ color: theme.palette.text.secondary, fontSize: 128 }}
        />
        <Typography
          variant="h2"
          color="textSecondary"
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          {t(
            'boardInvite.title',
            'You have been invited to the following board:',
          )}
        </Typography>
        <Typography variant="h2" sx={{ marginBottom: 1 }}>
          {roomName}
        </Typography>
        <Typography
          color="textSecondary"
          sx={{ marginBottom: 3 }}
          component="div"
        >
          {t('boardInvite.invitedBy', 'Invited by')}{' '}
          <Chip
            key={invite.senderUserId}
            avatar={
              <ElementAvatar
                userId={invite.senderUserId}
                displayName={invite.senderDisplayName ?? invite.senderUserId}
                src={avatarUrl ?? ''}
              >
                {invite.senderDisplayName?.substring(0, 1)}
              </ElementAvatar>
            }
            label={invite.senderDisplayName}
          />
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAcceptInvite}>
            {t('invitesDialog.accept', 'Accept Invite')}
          </Button>
          <Button variant="outlined" onClick={handleRejectClick}>
            {t('invitesDialog.reject', 'Reject Invite')}
          </Button>
        </Stack>
      </BoardInviteContainer>
      <ConfirmDialog
        confirmActionLabel={t('boardInviteDialog.reject', 'Reject invite')}
        onClose={onclose}
        onConfirm={handleRejectInvite}
        open={open}
        title={t(
          'boardInviteDialog.title',
          'Are you sure you want to reject this invite?',
        )}
        text={t(
          'boardInviteDialog.text',
          'Rejecting this invite means you will not be able to join and collaborate with other users on this board.',
        )}
      />
    </>
  );
};
