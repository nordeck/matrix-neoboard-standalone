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

import React from 'react';
import { selectViewMode, useAppSelector } from '../../store';
import { DashboardListView } from './DashboardListView.tsx';
import { DashboardTileView } from './DashboardTileView.tsx';
import { DashboardItem } from './useDashboardList.ts';

export type CreateBoardItemProps = {
  onClick: () => void;
};

export type BoardItemProps = {
  onClick: () => void;
  previewUrl: string;
  dashboardItem: DashboardItem;
};

export type DashboardViewProps = {
  items: DashboardItem[];
  onCreate: () => Promise<void>;
  onSelect: (item: DashboardItem) => void;
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
