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

import { ElementAvatar } from '@matrix-widget-toolkit/mui';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';

import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  getUserColor,
  useUserDetails,
} from '@nordeck/matrix-neoboard-react-sdk';
import React, { MouseEventHandler, useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn } from '../../state';
import { AboutDialog } from './AboutDialog';
import { LanguageDialog } from './LanguageDialog';
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

  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLanguageClick = useCallback(() => {
    setAnchorEl(null);
    setLanguageDialogOpen(true);
  }, [setAnchorEl]);

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
      <LanguageDialog
        onClose={useCallback(() => setLanguageDialogOpen(false), [])}
        open={languageDialogOpen}
        // onLanguageSelected={useCallback(() => setLanguageDialogOpen(false), [])}
      />

      <AboutDialog
        onClose={useCallback(() => setAboutDialogOpen(false), [])}
        open={aboutDialogOpen}
      />

      <LogoutDialog
        onClose={useCallback(() => setLogoutDialogOpen(false), [])}
        open={logoutDialogOpen}
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
            sx={{ width: 32, height: 32 }}
            userId={userId}
            displayName={username}
            avatarUrl={avatarUrl}
            style={{ outline: `${getUserColor(userId)} solid 2px` }}
          />
        </IconButton>
      </Tooltip>
      <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <ListItemIcon
            sx={{
              paddingRight: '16px',
            }}
          >
            <ElementAvatar
              sx={{ width: 32, height: 32 }}
              userId={userId}
              displayName={username}
              avatarUrl={avatarUrl}
              style={{ outline: `${getUserColor(userId)} solid 2px` }}
            />
          </ListItemIcon>
          <ListItemText>
            {username !== userId && (
              <Typography variant="h4" color="textPrimary">
                {username}
              </Typography>
            )}
            <Typography variant="h5" color="textSecondary">
              {userId}
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLanguageClick}>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('userMenu.language', 'Language')}</ListItemText>
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
