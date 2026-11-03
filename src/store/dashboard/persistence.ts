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

import { isLastViewEnabled } from '../../lib';
import { tryLoadValidatedFromLocalStorage } from '../../lib/storage';
import {
  DashboardState,
  SortBy,
  dashboardStateSchema,
  defaultSortDirections,
} from './dashboardState';

/**
 * Key under which the dashboard part of the store is persisted.
 */
const localStorageKey = 'neoboard-store-dashboard';

/**
 * Load the dashboard state from local storage.
 * If nothing is stored or the stored state is invalid, return the default state.
 */
export function loadDashboardState(): DashboardState {
  const defaultSortBy: SortBy = isLastViewEnabled()
    ? 'recently_viewed'
    : 'modified';
  const defaultState: DashboardState = {
    sortBy: defaultSortBy,
    sortDirection: defaultSortDirections[defaultSortBy],
    viewMode: 'tile',
  };

  const storedState = tryLoadValidatedFromLocalStorage(
    localStorageKey,
    dashboardStateSchema,
  );

  if (!storedState) {
    return defaultState;
  }

  const state: DashboardState = {
    sortBy: storedState.sortBy,
    sortDirection: storedState.sortDirection,
    viewMode: storedState.viewMode,
  };

  // Sorting by last view is not available while the last view is disabled
  if (state.sortBy === 'recently_viewed' && !isLastViewEnabled()) {
    return {
      ...state,
      sortBy: defaultState.sortBy,
      sortDirection: defaultState.sortDirection,
    };
  }

  return state;
}

/**
 * Save the dashboard part of the store to local storage.
 */
export function saveDashboardState(state: DashboardState): void {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
