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
import { isLastViewEnabled } from '../../lib';
import { loadDashboardState, saveDashboardState } from './persistence';

vi.mock('../../lib', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib')>()),
  isLastViewEnabled: vi.fn(),
}));

const localStorageKey = 'neoboard-store-dashboard';

describe('loadDashboardState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(isLastViewEnabled).mockReturnValue(false);
  });

  it('should return the default state if nothing is stored', () => {
    expect(loadDashboardState()).toEqual({
      sortBy: 'modified',
      sortDirection: 'desc',
      viewMode: 'tile',
    });
  });

  it('should load a stored state', () => {
    saveDashboardState({
      sortBy: 'name',
      sortDirection: 'desc',
      viewMode: 'list',
    });

    expect(loadDashboardState()).toEqual({
      sortBy: 'name',
      sortDirection: 'desc',
      viewMode: 'list',
    });
  });

  it('should apply the default direction if none is stored', () => {
    localStorage.setItem(localStorageKey, JSON.stringify({ sortBy: 'name' }));

    expect(loadDashboardState()).toEqual({
      sortBy: 'name',
      sortDirection: 'asc',
      viewMode: 'tile',
    });
  });

  it('should fall back to the default sorting if the last view is disabled', () => {
    saveDashboardState({
      sortBy: 'recently_viewed',
      sortDirection: 'asc',
      viewMode: 'list',
    });

    expect(loadDashboardState()).toEqual({
      sortBy: 'modified',
      sortDirection: 'desc',
      viewMode: 'list',
    });
  });

  it('should keep sorting by last view if the last view is enabled', () => {
    vi.mocked(isLastViewEnabled).mockReturnValue(true);
    saveDashboardState({
      sortBy: 'recently_viewed',
      sortDirection: 'asc',
      viewMode: 'list',
    });

    expect(loadDashboardState()).toEqual({
      sortBy: 'recently_viewed',
      sortDirection: 'asc',
      viewMode: 'list',
    });
  });

  it.each([
    ['name_asc', 'name', 'asc'],
    ['name_desc', 'name', 'desc'],
    ['created_asc', 'created', 'asc'],
    ['created_desc', 'created', 'desc'],
  ])(
    'should migrate the legacy sort value %s',
    (legacySortBy, sortBy, sortDirection) => {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ sortBy: legacySortBy, viewMode: 'list' }),
      );

      expect(loadDashboardState()).toEqual({
        sortBy,
        sortDirection,
        viewMode: 'list',
      });
    },
  );
});
