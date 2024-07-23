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

import { loadValidatedFromLocalStorage } from '../../lib/storage';
import { DashboardState, dashboardStateSchema } from './dashboardSlice';

/**
 * Key under which the dashboard part of the store is persisted.
 */
const localStorageKey = 'neoboard-store-dashboard';

/**
 * Load the dashboard state from local storage.
 * If it fails, return the default state.
 */
export function loadDashboardState(): DashboardState {
  return (
    loadValidatedFromLocalStorage(localStorageKey, dashboardStateSchema) ?? {
      // Fall back to default value
      sortBy: 'recently_viewed',
    }
  );
}

/**
 * Save the dashboard part of the store to local storage.
 */
export function saveDashboardState(state: DashboardState): void {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
