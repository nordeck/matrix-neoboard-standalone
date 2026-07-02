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
import { Button, Chip, Stack, styled, Typography } from '@mui/material';
import { useUserDetails } from '@nordeck/matrix-neoboard-react-sdk';
import { isEqual } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLoggedIn } from '../../state';
import { InviteEntry } from '../../store';
import { ConfirmDialog } from '../ConfirmDialog';
import { getDeclinedRooms, setDeclinedRooms } from './declinedRoom.ts';
import { MessageContainer } from './MessageContainer';

const BoardInviteContainer = styled(MessageContainer)({
  textAlign: 'center',
});

type BoardInviteProps = {
  invite: InviteEntry;
};

export const BoardInvite = ({
  invite: { roomId, roomName, senderUserId, senderDisplayName },
}: BoardInviteProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { standaloneClient, userId } = useLoggedIn();
  const { getUserAvatarUrl } = useUserDetails();
  const avatarUrl = getUserAvatarUrl(senderUserId);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleAcceptInvite = useCallback(async () => {
    try {
      await standaloneClient.joinRoom(roomId);
      const roomIds = getDeclinedRooms(userId);
      const updatedRoomIds = roomIds.filter((id: string) => id !== roomId);
      if (!isEqual(updatedRoomIds, roomIds)) {
        setDeclinedRooms(userId, updatedRoomIds);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }, [roomId, standaloneClient, userId]);

  const handleRejectInvite = useCallback(async () => {
    try {
      await standaloneClient.leaveRoom(roomId);

      const roomIds = getDeclinedRooms(userId);
      if (!roomIds.includes(roomId)) {
        roomIds.push(roomId);
        setDeclinedRooms(userId, roomIds);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }

    navigate('/dashboard', { state: { inviteDeclined: true }, replace: true });
  }, [roomId, standaloneClient, userId, navigate]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <BoardInviteContainer>
        <MarkEmailUnreadIcon sx={{ color: 'text.secondary', fontSize: 128 }} />
        <Typography
          variant="h2"
          component="h1"
          color="textSecondary"
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          {t(
            'boardInvite.title',
            'You have been invited to the following board:',
          )}
        </Typography>
        <Typography variant="h2" sx={{ marginBottom: 1 }}>
          {roomName ?? t('dashboard.untitled', 'Untitled')}
        </Typography>
        <Typography
          color="textSecondary"
          sx={{ marginBottom: 3 }}
          component="div"
        >
          {t('boardInvite.invitedBy', 'Invited by')}{' '}
          <Chip
            avatar={
              <ElementAvatar
                userId={senderUserId}
                displayName={senderDisplayName ?? undefined}
                src={avatarUrl}
              />
            }
            label={senderDisplayName}
          />
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAcceptInvite}>
            {t('invitesDialog.accept', 'Accept Invite')}
          </Button>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            {t('invitesDialog.reject', 'Reject Invite')}
          </Button>
          {error && (
            <Typography color="red">
              {t('invitesDialog.actionFailed', 'Action failed')}
            </Typography>
          )}
        </Stack>
      </BoardInviteContainer>
      <ConfirmDialog
        confirmActionLabel={t('boardInviteDialog.reject', 'Reject invite')}
        onClose={handleClose}
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
