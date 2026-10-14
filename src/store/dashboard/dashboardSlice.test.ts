/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

import { describe, expect, it } from 'vitest';
import { dashboardReducer, setViewMode, toggleSortBy } from './dashboardSlice';
import { DashboardState } from './dashboardState';

const state: DashboardState = {
  sortBy: 'created',
  sortDirection: 'desc',
  viewMode: 'tile',
};

describe('dashboardSlice', () => {
  it('should toggle the direction of the active sort field', () => {
    const toggledState = dashboardReducer(state, toggleSortBy('created'));
    expect(toggledState).toEqual({ ...state, sortDirection: 'asc' });

    expect(dashboardReducer(toggledState, toggleSortBy('created'))).toEqual(
      state,
    );
  });

  it('should switch to another sort field with its default direction', () => {
    expect(dashboardReducer(state, toggleSortBy('name'))).toEqual({
      ...state,
      sortBy: 'name',
      sortDirection: 'asc',
    });
    expect(
      dashboardReducer(
        { ...state, sortBy: 'name', sortDirection: 'asc' },
        toggleSortBy('recently_viewed'),
      ),
    ).toEqual({ ...state, sortBy: 'recently_viewed', sortDirection: 'desc' });
  });

  it('should set the view mode', () => {
    expect(dashboardReducer(state, setViewMode('list'))).toEqual({
      ...state,
      viewMode: 'list',
    });
  });
});
