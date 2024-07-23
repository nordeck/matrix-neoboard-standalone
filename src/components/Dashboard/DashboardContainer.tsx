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

import { Box, useTheme } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export const DashboardContainer: React.FC<PropsWithChildren<{}>> = function ({
  children,
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      {children}
    </Box>
  );
};
