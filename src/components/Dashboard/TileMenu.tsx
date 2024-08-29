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
