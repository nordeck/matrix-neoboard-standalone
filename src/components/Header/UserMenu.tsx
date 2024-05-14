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

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { t } from 'i18next';
import React, { useCallback, useState } from 'react';
import { useLoggedIn } from '../../state';
import { LogoutDialog } from './LogoutDialog';
import dummyAvatar from './dummy-avatar.png';

export function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const handleLogoutClick = useCallback(() => {
    setAnchorEl(null);
    setLogoutDialogOpen(true);
  }, [setAnchorEl, setLogoutDialogOpen]);

  const { userId } = useLoggedIn();
  const username = userId.substring(1, userId.indexOf(':'));
  const initial = username.substring(0, 1);

  return (
    <>
      <LogoutDialog
        onClose={() => setLogoutDialogOpen(false)}
        open={logoutDialogOpen}
      />
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 'auto' }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 30, height: 30 }} src={dummyAvatar}>
          {initial}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled={true}>
          <ListItemIcon />
          <ListItemText>{username}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('userMenu.profile', 'Profile')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('userMenu.userManagement', 'User Management')}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('userMenu.logOut', 'Log out')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
