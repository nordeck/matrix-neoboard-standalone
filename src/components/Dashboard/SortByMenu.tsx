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
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { TFunction } from 'i18next';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { isLastViewEnabled } from '../../lib';
import { SortBy } from '../../store';
import { SecondaryTextButton } from '../lib';
import { SortDirectionIcon } from './SortDirectionIcon';
import { useSortToggle } from './useSortToggle';

type SortOption = {
  id: SortBy;
  label: string;
};

const sortByOptions = (t: TFunction): SortOption[] => {
  const options: SortOption[] = [];

  if (isLastViewEnabled()) {
    options.push({
      id: 'recently_viewed',
      label: t('dashboard.sortBy.recently_viewed', 'Recently viewed'),
    });
  }

  options.push(
    {
      id: 'name',
      label: t('dashboard.sortBy.name', 'Name'),
    },
    {
      id: 'created',
      label: t('dashboard.sortBy.created', 'Date created'),
    },
  );

  return options;
};

/**
 * A sort field in the sort by menu.
 * Selecting it toggles the sorting.
 */
function SortByMenuItem({ id, label }: SortOption) {
  const { active, sortDirection, toggle } = useSortToggle(id);

  return (
    <MenuItem onClick={toggle}>
      <ListItemIcon>{active && <Check fontSize="small" />}</ListItemIcon>
      <ListItemText sx={{ marginRight: '8px' }}>{label}</ListItemText>
      <ListItemIcon>
        {sortDirection && <SortDirectionIcon sortDirection={sortDirection} />}
      </ListItemIcon>
    </MenuItem>
  );
}

/**
 * Display the sort by button and menu.
 * Connects the the dashboard slice of the application's store.
 */
export const SortByMenu: React.FC = function () {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

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
        {sortByOptions(t).map((sortByOption) => (
          <SortByMenuItem key={sortByOption.id} {...sortByOption} />
        ))}
      </Menu>
    </div>
  );
};
