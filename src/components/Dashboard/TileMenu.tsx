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

import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import React, { ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteDialog } from '../DeleteDialog';
import { RenameDialog } from '../RenameDialog';
import { DashboardItem } from './useDashboardList';

type TileMenuProps = {
  item: DashboardItem;
};

export const TileMenu: React.FC<TileMenuProps> = function ({ item }) {
  const roomId = item.roomId;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { deleteDialog, setDeleteDialogOpen } = useDeleteDialog(roomId);

  /**
   * Toggle the menu
   */
  const handleMenuButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (anchorEl === null) {
        setAnchorEl(event.currentTarget);
        return;
      }

      setAnchorEl(null);
    },
    [anchorEl],
  );

  const handleRenameClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Close menu
      setAnchorEl(null);
      setRenameDialogOpen(true);
    },
    [],
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Close menu
      setAnchorEl(null);
      setDeleteDialogOpen(true);
    },
    [setDeleteDialogOpen],
  );

  const handleCloseRenameDialog = useCallback(() => {
    setRenameDialogOpen(false);
  }, []);

  return (
    <>
      {deleteDialog}
      <RenameDialog
        onClose={handleCloseRenameDialog}
        open={renameDialogOpen}
        item={item}
      />
      <MenuButton
        id={`board-menu-${roomId}-button`}
        aria-controls={open ? `board-menu-${roomId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuButtonClick}
      />
      <Menu
        id={`board-menu-${roomId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuButtonClick}
        MenuListProps={{
          'aria-labelledby': `board-menu-${roomId}-button`,
        }}
      >
        <MenuList>
          {item.permissions.canChangeName && (
            <>
              <MenuItem onClick={handleRenameClick}>
                <ListItemIcon>
                  <DriveFileRenameOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {t('dashboard.boardTile.rename', 'Rename')}
                </ListItemText>
              </MenuItem>
              <Divider />
            </>
          )}
          {item.permissions.canSendTombstone && (
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {t('dashboard.boardTile.delete', 'Delete')}
              </ListItemText>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

const MenuButton: React.FC<ComponentProps<typeof IconButton>> = function (
  props,
) {
  return (
    <IconButton {...props}>
      <MoreHorizIcon />
    </IconButton>
  );
};
