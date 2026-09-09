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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { SvgIcon, SvgIconProps } from '@mui/material';

// opendesk navbar styling
const iconPrimaryColor = getEnvironment(
  'REACT_APP_OPENDESK_BANNER_WHITEBOARD_ICON_PRIMARY',
  '#5e27dd',
);
// opendesk navbar styling
const iconSecondaryColor = getEnvironment(
  'REACT_APP_OPENDESK_BANNER_WHITEBOARD_ICON_SECONDARY',
  '#3a1c99',
);

export const WhiteboardIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32">
      <rect
        fill={iconPrimaryColor}
        x="1.88"
        y="7.88"
        width="28"
        height="16"
        rx="2"
        ry="2"
      />
      <rect
        fill={iconSecondaryColor}
        x="9.88"
        y="1.87"
        width="12"
        height="4"
        rx="2"
        ry="2"
      />
      <polygon
        fill={iconSecondaryColor}
        points="27.88 31.88 23.88 31.88 20.88 25.88 24.88 25.88 27.88 31.88"
      />
      <polygon
        fill={iconSecondaryColor}
        points="3.79 31.88 7.79 31.88 10.79 25.88 6.79 25.88 3.79 31.88"
      />
    </SvgIcon>
  );
};
