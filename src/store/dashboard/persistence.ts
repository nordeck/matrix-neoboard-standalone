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

import { tryLoadValidatedFromLocalStorage } from '../../lib/storage';
import {
  DashboardState,
  dashboardStateSchema,
  defaultDashboardState,
} from './dashboardState';

/**
 * Key under which the dashboard part of the store is persisted.
 */
const localStorageKey = 'neoboard-store-dashboard';

/**
 * Load the dashboard state from local storage.
 */
export function loadDashboardState(): DashboardState {
  const persistedState: Partial<DashboardState> | null =
    tryLoadValidatedFromLocalStorage(localStorageKey, dashboardStateSchema);

  const state: DashboardState = {
    // Fall back to default values if an entry is missing from the store
    ...defaultDashboardState,
    ...persistedState,
  };

  if (
    persistedState === null &&
    localStorage.getItem(localStorageKey) !== null
  ) {
    // An entry exists, but could not be read. Reset it, so that the next load
    // does not run into the same error again.
    saveDashboardState(state);
  }

  return state;
}

/**
 * Save the dashboard part of the store to local storage.
 */
export function saveDashboardState(state: DashboardState): void {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
