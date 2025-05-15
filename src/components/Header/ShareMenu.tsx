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

import {
  hasActionPower,
  PowerLevelsStateEvent,
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
  const { data } = useSWR<PowerLevelsStateEvent[]>(
    roomId,
    client.standaloneClient.getPowerLevelEvent.bind(client.standaloneClient),
    { suspense: true },
  );

  // If we don't have the power level event, we can't calculate if the user can invite.
  // We assume the user can't invite in this case.
  if (!data) {
    return null;
  }

  // If the user is not allowed to invite, we don't show the menu item.
  if (!hasActionPower(data[0], client.userId, 'invite')) {
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
            height: 40,
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
