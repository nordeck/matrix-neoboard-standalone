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

import { useCallback } from 'react';
import {
  SortBy,
  SortDirection,
  selectSortBy,
  selectSortDirection,
  toggleSortBy,
  useAppDispatch,
  useAppSelector,
} from '../../store';

/**
 * Provides the sort state of a single sort field.
 *
 * @param sortBy - the sort field
 * @returns whether the field is active, its direction (only if active)
 *          and a callback that toggles the sorting
 */
export function useSortToggle(sortBy: SortBy): {
  active: boolean;
  sortDirection: SortDirection | undefined;
  toggle: () => void;
} {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => selectSortBy(state)) === sortBy;
  const currentSortDirection = useAppSelector((state) =>
    selectSortDirection(state),
  );

  const toggle = useCallback(() => {
    dispatch(toggleSortBy(sortBy));
  }, [dispatch, sortBy]);

  return {
    active,
    sortDirection: active ? currentSortDirection : undefined,
    toggle,
  };
}
