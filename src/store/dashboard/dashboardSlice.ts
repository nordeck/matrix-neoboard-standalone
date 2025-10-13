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

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Joi from 'joi';
import { RootState } from '../store';
import { loadDashboardState } from './persistence';

export type SortBy =
  | 'recently_viewed'
  | 'name_asc'
  | 'name_desc'
  | 'created_asc'
  | 'created_desc';

export type ViewMode = 'tile' | 'list';

export interface DashboardState {
  sortBy: SortBy;
  viewMode: ViewMode;
}

export const dashboardStateSchema = Joi.object({
  sortBy: Joi.string()
    .valid(
      'recently_viewed',
      'name_asc',
      'name_desc',
      'created_asc',
      'created_desc',
    )
    .required(),
  viewMode: Joi.string().valid('tile', 'list'),
}).unknown();

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: loadDashboardState(),
  reducers: {
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      return {
        ...state,
        sortBy: action.payload,
      };
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      return {
        ...state,
        viewMode: action.payload,
      };
    },
  },
});

export const { setSortBy, setViewMode } = dashboardSlice.actions;

export const selectSortBy = (state: RootState) => state.dashboardReducer.sortBy;
export const selectViewMode = (state: RootState) =>
  state.dashboardReducer.viewMode;

export const dashboardReducer = dashboardSlice.reducer;
