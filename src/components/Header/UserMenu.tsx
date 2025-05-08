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

import { ElementAvatar } from '@matrix-widget-toolkit/mui';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  getUserColor,
  useUserDetails,
} from '@nordeck/matrix-neoboard-react-sdk';
import React, { MouseEventHandler, useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { AboutDialog } from './AboutDialog';
import { LogoutDialog } from './LogoutDialog';

export function UserMenu() {
  const { t } = useTranslation();
  const menuId = useId();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick: MouseEventHandler<HTMLElement> = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const handleAboutClick = useCallback(() => {
    setAnchorEl(null);
    setAboutDialogOpen(true);
  }, [setAnchorEl, setAboutDialogOpen]);

  const handleLogoutClick = useCallback(() => {
    setAnchorEl(null);
    setLogoutDialogOpen(true);
  }, [setAnchorEl, setLogoutDialogOpen]);

  const { userId } = useLoggedIn();
  const { getUserAvatarUrl, getUserDisplayName } = useUserDetails();

  const username = getUserDisplayName(userId);
  const avatarUrl = getUserAvatarUrl(userId);

  return (
    <>
      <LogoutDialog
        onClose={useCallback(() => setLogoutDialogOpen(false), [])}
        open={logoutDialogOpen}
      />
      <AboutDialog
        onClose={useCallback(() => setAboutDialogOpen(false), [])}
        open={aboutDialogOpen}
      />
      <Tooltip title={t('userMenu.tooltip', 'User menu')}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <ElementAvatar
            sx={{ width: 30, height: 30 }}
            userId={userId}
            displayName={username}
            avatarUrl={avatarUrl}
            style={{ outline: `${getUserColor(userId)} solid 2px` }}
          />
        </IconButton>
      </Tooltip>
      <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled={true}>
          <ListItemIcon />
          <ListItemText>{username}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAboutClick}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('userMenu.about', 'About')}</ListItemText>
        </MenuItem>
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
