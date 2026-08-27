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

import {
  hasActionPower,
  PowerLevelsStateEvent,
  StateEvent,
  StateEventCreateContent,
} from '@matrix-widget-toolkit/api';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, ListItem, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { MemberEntry } from '../../store/api/selectors/selectMembers';
import useSWR from 'swr';

type MembersDialogRowProps = {
    member: MemberEntry;
};

export const MemberDialogRow: React.FC<MembersDialogRowProps> = ({
  member,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [hasPendingAction, setHasPendingAction] = useState(false);
  const [success, setSuccess] = useState(false);
  let canKick = true;

  const { userId, standaloneClient } = useLoggedIn();

  const client = useLoggedIn();
  const { data: powerLevelsEvent } = useSWR<
    StateEvent<PowerLevelsStateEvent> | undefined
  >(
    member.roomId,
    client.standaloneClient.getPowerLevelEvent.bind(client.standaloneClient),
    { suspense: true },
  );
  const { data: roomCreateEvent } = useSWR<
    StateEvent<StateEventCreateContent> | undefined
  >(
    member.roomId,
    client.standaloneClient.getRoomCreateEvent.bind(client.standaloneClient),
    { suspense: true },
  );

  // If we don't have the power level event, we can't calculate if the user can kick.
  // We assume the user can't kick in this case.
  if (!powerLevelsEvent) {
    canKick = false;
  }

  // If the user is not allowed to kick, we don't show the menu item.
  if (
    !hasActionPower(
      powerLevelsEvent?.content,
      roomCreateEvent,
      client.userId,
      'kick',
    )
  ) {
    canKick = false;
  }


  const handleRemoveMember = async () => {
    setHasPendingAction(true);
    try {
      await standaloneClient.removeMember(member.roomId, member.userId, 'Removed by admin');
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setHasPendingAction(false);
    }
  };

  if (success) {
    return null;
  }

  return (
    <ListItem
      secondaryAction={
        (canKick || userId === member.userId) && (
          <IconButton
            aria-label={t('membersDialog.removeMember', 'Remove member')}
            disabled={hasPendingAction}
            edge="end"
            onClick={handleRemoveMember}
        >
          <LogoutIcon />
        </IconButton>
  )}
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
            {member.userDisplayName ?? member.userId}
            {member.userId == userId ? ` (${t('membersDialog.you', 'you')})` : ''}
          </Typography>
        }
      />
      {error && (
        <Typography color="red">
          {t('membersDialog.actionFailed', 'Action failed')}
        </Typography>
      )}
    </ListItem>
  );
};
