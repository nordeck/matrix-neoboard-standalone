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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDashboardState } from './dashboardState';
import { loadDashboardState, saveDashboardState } from './persistence';

const localStorageKey = 'neoboard-store-dashboard';

describe('loadDashboardState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return the defaults if nothing has been persisted', () => {
    expect(loadDashboardState()).toEqual(defaultDashboardState);
  });

  it('should return the persisted state', () => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ sortBy: 'name_asc', viewMode: 'list' }),
    );

    expect(loadDashboardState()).toEqual({
      sortBy: 'name_asc',
      viewMode: 'list',
    });
  });

  it('should fill in defaults for entries missing from the persisted state', () => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ sortBy: 'name_asc' }),
    );

    expect(loadDashboardState()).toEqual({
      sortBy: 'name_asc',
      viewMode: 'tile',
    });
  });

  it('should reset to the defaults for a value the schema no longer allows', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // A sort option persisted by another version of the app
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ sortBy: 'last_update', viewMode: 'list' }),
    );

    expect(loadDashboardState()).toEqual(defaultDashboardState);
  });

  it('should reset to the defaults for a corrupt entry', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(localStorageKey, 'not json');

    expect(loadDashboardState()).toEqual(defaultDashboardState);
  });

  it('should overwrite an entry that could not be read', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(localStorageKey, 'not json');

    loadDashboardState();

    // The next load must not run into the same error again
    expect(localStorage.getItem(localStorageKey)).toEqual(
      JSON.stringify(defaultDashboardState),
    );
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('should not write anything if nothing has been persisted', () => {
    loadDashboardState();

    expect(localStorage.getItem(localStorageKey)).toBeNull();
  });
});

describe('saveDashboardState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should round-trip the state', () => {
    saveDashboardState({ sortBy: 'created_desc', viewMode: 'list' });

    expect(loadDashboardState()).toEqual({
      sortBy: 'created_desc',
      viewMode: 'list',
    });
  });
});
