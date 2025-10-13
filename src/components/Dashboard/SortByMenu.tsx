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

import { Check } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { TFunction } from 'i18next';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SortBy,
  selectSortBy,
  setSortBy,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { SecondaryTextButton } from '../lib';

const sortByOptions = (
  t: TFunction,
): {
  id: SortBy;
  label: string;
  icon: string | React.ReactElement;
}[] => [
  {
    id: 'recently_viewed',
    label: t('dashboard.sortBy.recently_viewed', 'Recently viewed'),
    icon: '',
  },
  {
    id: 'name_asc',
    label: t('dashboard.sortBy.alphabetical', 'Alphabetical'),
    icon: 'A-Z',
  },
  {
    id: 'name_desc',
    label: t('dashboard.sortBy.alphabetical', 'Alphabetical'),
    icon: 'Z-A',
  },
  {
    id: 'created_asc',
    label: t('dashboard.sortBy.created', 'Date created'),
    icon: <NorthIcon fontSize="small" />,
  },
  {
    id: 'created_desc',
    label: t('dashboard.sortBy.created', 'Date created'),
    icon: <SouthIcon fontSize="small" />,
  },
];

/**
 * Display the sort by button and menu.
 * Connects the the dashboard slice of the application's store.
 */
export const SortByMenu: React.FC = function () {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const sortBy = useAppSelector((state) => selectSortBy(state));
  const sortByItems = useMemo(() => {
    return sortByOptions(t).map((sortByOption) => {
      const handleMenuItemClick = () => {
        setAnchorEl(null);
        dispatch(setSortBy(sortByOption.id));
      };

      return (
        <MenuItem key={sortByOption.id} onClick={handleMenuItemClick}>
          <ListItemIcon>
            {sortBy === sortByOption.id && <Check fontSize="small" />}
          </ListItemIcon>
          <ListItemText sx={{ marginRight: '8px' }}>
            {sortByOption.label}
          </ListItemText>
          <ListItemIcon>{sortByOption.icon}</ListItemIcon>
        </MenuItem>
      );
    });
  }, [dispatch, sortBy, t]);

  /**
   * Toggle the menu
   */
  const handleMenuButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (anchorEl === null) {
        setAnchorEl(event.currentTarget);
        return;
      }

      setAnchorEl(null);
    },
    [anchorEl],
  );

  return (
    <div>
      <SecondaryTextButton
        id="sort-by-button"
        aria-controls={open ? 'sort-by-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuButtonClick}
        sx={{ fontSize: '12px' }}
      >
        {t('dashboard.sortBy.button', 'Sort by:')}
        <ArrowDropDownIcon />
      </SecondaryTextButton>
      <Menu
        id="sort-by-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuButtonClick}
        MenuListProps={{
          'aria-labelledby': 'sort-by-button',
        }}
      >
        {sortByItems}
      </Menu>
    </div>
  );
};
