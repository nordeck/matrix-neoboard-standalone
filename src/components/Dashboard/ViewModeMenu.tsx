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

import { GridView, List } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import React from 'react';
import i18n from '../../i18n.ts';
import {
  ViewMode,
  selectViewMode,
  setViewMode,
  useAppDispatch,
  useAppSelector,
} from '../../store';

const options: {
  id: ViewMode;
  label: string;
  icon: string | React.ReactElement;
}[] = [
  {
    id: 'tile',
    label: i18n.t('dashboard.viewMode.tile', 'Grid view'),
    icon: <GridView sx={{ fontSize: '1rem' }} />,
  },
  {
    id: 'list',
    label: i18n.t('dashboard.viewMode.list', 'List view'),
    icon: <List sx={{ fontSize: '1rem' }} />,
  },
];

/**
 * Allows switching between tile and list view mode
 * Uses the dashboard slice of the application's store.
 */
export const ViewModeMenu: React.FC = function () {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => selectViewMode(state));
  const handleItemClick = (
    event: React.MouseEvent<HTMLElement>,
    viewMode: ViewMode | null,
  ) => {
    if (viewMode !== null) {
      dispatch(setViewMode(viewMode));
    }
  };

  return (
    <>
      <ToggleButtonGroup
        size="small"
        value={viewMode}
        exclusive
        onChange={handleItemClick}
        aria-label="text alignment"
      >
        {options.map((option) => (
          <Tooltip title={option.label}>
            <ToggleButton value={option.id}>{option.icon}</ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </>
  );
};
