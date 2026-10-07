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

import { ButtonBase, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isLastViewEnabled } from '../../lib';
import { SortBy } from '../../store';
import { SortDirectionIcon } from './SortDirectionIcon';
import { useSortToggle } from './useSortToggle';

/**
 * Column header that displays the sorting of the column, if it is active.
 * Clicking the column title toggles the sorting.
 */
function SortableColumnHeader({
  sortBy,
  label,
}: {
  sortBy: SortBy;
  label: string;
}) {
  const { t } = useTranslation();
  const { sortDirection, toggle } = useSortToggle(sortBy);

  return (
    <Typography
      variant="h6"
      color="textSecondary"
      component="th"
      sx={{ fontSize: 13 }}
      aria-sort={
        sortDirection && (sortDirection === 'asc' ? 'ascending' : 'descending')
      }
    >
      <ButtonBase
        onClick={toggle}
        aria-label={t('dashboard.boardList.sortBy', 'Sort by {{column}}', {
          column: label,
        })}
        sx={{ font: 'inherit', gap: 0.5, minHeight: 20 }}
      >
        {label}
        {sortDirection && <SortDirectionIcon sortDirection={sortDirection} />}
      </ButtonBase>
    </Typography>
  );
}

export function DashboardListHeader() {
  const { t } = useTranslation();

  return (
    <tr>
      <Typography
        variant="h6"
        color="textSecondary"
        component="th"
        sx={{ fontSize: 13 }}
      />
      <SortableColumnHeader
        sortBy="name"
        label={t('dashboard.boardList.name', 'Name')}
      />
      {isLastViewEnabled() && (
        <SortableColumnHeader
          sortBy="recently_viewed"
          label={t('dashboard.boardList.lastView', 'Recently viewed')}
        />
      )}
      <SortableColumnHeader
        sortBy="created"
        label={t('dashboard.boardList.created', 'Created')}
      />
    </tr>
  );
}
