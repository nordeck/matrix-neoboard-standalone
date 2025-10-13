// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { GridView, List } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ViewMode,
  selectViewMode,
  setViewMode,
  useAppDispatch,
  useAppSelector,
} from '../../store';

const options = (
  t: TFunction,
): {
  id: ViewMode;
  label: string;
  icon: string | React.ReactElement;
}[] => [
  {
    id: 'tile',
    label: t('dashboard.viewMode.tile', 'Grid view'),
    icon: <GridView sx={{ fontSize: '1rem' }} />,
  },
  {
    id: 'list',
    label: t('dashboard.viewMode.list', 'List view'),
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
  const { t } = useTranslation();

  const handleItemClick = (
    _event: React.MouseEvent<HTMLElement>,
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
        {options(t).map((option) => (
          <Tooltip key={option.id} title={option.label}>
            <ToggleButton value={option.id}>{option.icon}</ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </>
  );
};
