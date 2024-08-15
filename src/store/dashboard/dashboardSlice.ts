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
