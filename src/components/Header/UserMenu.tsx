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
