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

import { SvgIcon, SvgIconProps } from '@mui/material';

export const WhiteboardIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32">
      <rect
        fill="#5e27dd"
        x="1.88"
        y="7.88"
        width="28"
        height="16"
        rx="2"
        ry="2"
      />
      <rect
        fill="#3a1c99"
        x="9.88"
        y="1.87"
        width="12"
        height="4"
        rx="2"
        ry="2"
      />
      <polygon
        fill="#3a1c99"
        points="27.88 31.88 23.88 31.88 20.88 25.88 24.88 25.88 27.88 31.88"
      />
      <polygon
        fill="#3a1c99"
        points="3.79 31.88 7.79 31.88 10.79 25.88 6.79 25.88 3.79 31.88"
      />
    </SvgIcon>
  );
};
