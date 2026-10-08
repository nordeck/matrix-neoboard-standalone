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
import { loadValidatedFromLocalStorage } from '../../lib/storage';
import {
  DashboardState,
  LegacySortBy,
  SortBy,
  SortDirection,
  dashboardStateSchema,
  defaultSortDirections,
} from './dashboardState';

/**
 * Key under which the dashboard part of the store is persisted.
 */
const localStorageKey = 'neoboard-store-dashboard';

/**
 * Load the dashboard state from local storage.
 * If it fails, return the default state.
 */
export function loadDashboardState(): DashboardState {
  const storedState = loadValidatedFromLocalStorage<
    Omit<Partial<DashboardState>, 'sortBy'> & { sortBy: SortBy | LegacySortBy }
  >(localStorageKey, dashboardStateSchema);
  const defaultSortBy: SortBy = isLastViewEnabled()
    ? 'recently_viewed'
    : 'modified';

  const state: DashboardState = {
    // Fall back to default values if an entry is missing from the store
    sortBy: defaultSortBy,
    sortDirection: defaultSortDirections[defaultSortBy],
    viewMode: 'tile',
    ...(storedState ? { ...storedState, ...migrateSortBy(storedState) } : {}),
  };

  // Sorting by last view is not available while the last view is disabled
  if (state.sortBy === 'recently_viewed' && !isLastViewEnabled()) {
    return {
      ...state,
      sortBy: defaultSortBy,
      sortDirection: defaultSortDirections[defaultSortBy],
    };
  }

  return state;
}

/**
 * Split a sort value into the sort field and direction.
 * Supports the legacy format that combined both in a single value
 * (e.g. `name_asc`).
 */
function migrateSortBy({
  sortBy,
  sortDirection,
}: {
  sortBy: SortBy | LegacySortBy;
  sortDirection?: SortDirection;
}): Pick<DashboardState, 'sortBy' | 'sortDirection'> {
  const [field, legacyDirection] = sortBy.split(/_(?=asc$|desc$)/) as [
    SortBy,
    SortDirection | undefined,
  ];

  return {
    sortBy: field,
    sortDirection:
      legacyDirection ?? sortDirection ?? defaultSortDirections[field],
  };
}

/**
 * Save the dashboard part of the store to local storage.
 */
export function saveDashboardState(state: DashboardState): void {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
