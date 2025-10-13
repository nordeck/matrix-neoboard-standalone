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

import React from 'react';
import { selectViewMode, useAppSelector } from '../../store';
import { DashboardListView } from './DashboardListView.tsx';
import { DashboardTileView } from './DashboardTileView.tsx';
import { DashboardItem } from './useDashboardList.ts';

export type CreateBoardItemProps = {
  onClick: () => Promise<void>;
};

export type BoardItemProps = {
  dashboardItem: DashboardItem;
};

export type DashboardViewProps = {
  items: DashboardItem[];
  onCreate: () => Promise<void>;
};

export const useDashboardView = (): React.FC<DashboardViewProps> => {
  const viewMode = useAppSelector((state) => selectViewMode(state));
  switch (viewMode) {
    case 'list':
      return DashboardListView;
    default:
    case 'tile':
      return DashboardTileView;
  }
};
