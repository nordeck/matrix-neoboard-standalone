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

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SortBy, ViewMode } from './dashboardState';
import { loadDashboardState } from './persistence';

export { dashboardStateSchema, defaultDashboardState } from './dashboardState';
export type { DashboardState, SortBy, ViewMode } from './dashboardState';

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
