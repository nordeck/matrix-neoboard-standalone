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

import { Check } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { t } from 'i18next';
import React, { useCallback, useMemo } from 'react';
import i18n from '../../i18n';
import {
  SortBy,
  selectSortBy,
  setSortBy,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { SecondaryTextButton } from '../lib';

const sortByOptions: {
  id: SortBy;
  label: string;
  icon: string | React.ReactElement;
}[] = [
  {
    id: 'recently_viewed',
    label: i18n.t('dashboard.sortBy.recently_viewed', 'Recently viewed'),
    icon: '',
  },
  {
    id: 'name_asc',
    label: i18n.t('dashboard.sortBy.alphabetical', 'Alphabetical'),
    icon: 'A-Z',
  },
  {
    id: 'name_desc',
    label: i18n.t('dashboard.sortBy.alphabetical', 'Alphabetical'),
    icon: 'Z-A',
  },
  {
    id: 'created_asc',
    label: i18n.t('dashboard.sortBy.created', 'Date created'),
    icon: <NorthIcon fontSize="small" />,
  },
  {
    id: 'created_desc',
    label: i18n.t('dashboard.sortBy.created', 'Date created'),
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

  const sortBy = useAppSelector((state) => selectSortBy(state));
  const sortByItems = useMemo(() => {
    return sortByOptions.map((sortByOption) => {
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
  }, [dispatch, sortBy]);

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
