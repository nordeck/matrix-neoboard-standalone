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

import {
  hasActionPower,
  PowerLevelsStateEvent,
  StateEvent,
  StateEventCreateContent,
} from '@matrix-widget-toolkit/api';
import { Group, Share } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useLoggedIn } from '../../state';
import { ShareMenuModal } from './ShareMenuModal';

export function ShareMenu({ roomId }: { roomId: string }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setInviteDialogOpen(false);
  }, [setAnchorEl, setInviteDialogOpen]);

  const handleInviteClick = useCallback(() => {
    setAnchorEl(null);
    setInviteDialogOpen(true);
  }, [setAnchorEl, setInviteDialogOpen]);

  // Get the powerlevel event so we can calculate if the menu is shown. We do this inside of here so it only happens when we are in the room.
  const client = useLoggedIn();
  const { data: powerLevelsEvent } = useSWR<
    StateEvent<PowerLevelsStateEvent> | undefined
  >(
    roomId,
    client.standaloneClient.getPowerLevelEvent.bind(client.standaloneClient),
    { suspense: true },
  );
  const { data: roomCreateEvent } = useSWR<
    StateEvent<StateEventCreateContent> | undefined
  >(
    roomId,
    client.standaloneClient.getRoomCreateEvent.bind(client.standaloneClient),
    { suspense: true },
  );

  // If we don't have the power level event, we can't calculate if the user can invite.
  // We assume the user can't invite in this case.
  if (!powerLevelsEvent) {
    return null;
  }

  // If the user is not allowed to invite, we don't show the menu item.
  if (
    !hasActionPower(
      powerLevelsEvent.content,
      roomCreateEvent,
      client.userId,
      'invite',
    )
  ) {
    return null;
  }

  return (
    <>
      <ShareMenuModal
        onClose={handleClose}
        open={inviteDialogOpen}
        selectedRoomId={roomId}
      />
      <Tooltip title={t('shareMenu.invite', 'Invite')}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-label={t('shareMenu.invite', 'Invite')}
          aria-controls={open ? 'share-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: 40,
          }}
        >
          <Share sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Tooltip>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleInviteClick}>
          <ListItemIcon>
            <Group fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('shareMenu.invite', 'Invite')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
