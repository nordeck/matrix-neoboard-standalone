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

import Joi from 'joi';

export type SortBy = 'recently_viewed' | 'name' | 'modified' | 'created';

export type SortDirection = 'asc' | 'desc';

export type ViewMode = 'tile' | 'list';

export interface DashboardState {
  sortBy: SortBy;
  sortDirection: SortDirection;
  viewMode: ViewMode;
}

export const dashboardStateSchema = Joi.object<DashboardState, true>({
  sortBy: Joi.string()
    .valid('recently_viewed', 'name', 'modified', 'created')
    .required(),
  sortDirection: Joi.string().valid('asc', 'desc').required(),
  viewMode: Joi.string().valid('tile', 'list').required(),
}).unknown();

/**
 * The direction that is applied when switching to a sort field.
 */
export const defaultSortDirections: Record<SortBy, SortDirection> = {
  recently_viewed: 'desc',
  name: 'asc',
  modified: 'desc',
  created: 'desc',
};
