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

import { Typography } from '@mui/material';
import { t } from 'i18next';

export function DashboardListHeader() {
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
        {t('dashboard.boardList.users', 'Users in board')}
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
