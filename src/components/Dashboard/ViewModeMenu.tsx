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
