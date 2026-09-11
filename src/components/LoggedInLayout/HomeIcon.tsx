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
import { ImgHTMLAttributes } from 'react';

const home_icon_src = getEnvironment(
  'REACT_APP_OPENDESK_BANNER_APP_HOME_ICON_SVG_URL',
  `${window.location.origin}/opendesk.svg`,
);

export const HomeIcon = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={home_icon_src} width={32} height={32} alt="" {...props} />;
};
