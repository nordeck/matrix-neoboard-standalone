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

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
      <Typography
        variant="h6"
        color="textSecondary"
        component="th"
        sx={{ fontSize: 13 }}
      >
        {t('dashboard.boardList.name', 'Name')}
      </Typography>
      <Typography
        variant="h6"
        color="textSecondary"
        component="th"
        sx={{ fontSize: 13 }}
      >
        {t('dashboard.boardList.lastView', 'Recently viewed')}
      </Typography>
      <Typography
        variant="h6"
        color="textSecondary"
        component="th"
        sx={{ fontSize: 13 }}
      >
        {t('dashboard.boardList.created', 'Created')}
      </Typography>
    </tr>
  );
}
