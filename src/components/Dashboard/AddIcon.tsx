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

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SxProps, Theme } from '@mui/material/styles';

type AddIconProps = {
  sx?: SxProps<Theme>;
};

export function AddIcon({ sx }: AddIconProps) {
  return (
    <AddRoundedIcon
      sx={[
        {
          color: 'primary.contrastText',
          backgroundColor: 'primary.dark',
          borderRadius: '4px',
          padding: 0.2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
