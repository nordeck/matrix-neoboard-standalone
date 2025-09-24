/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { PropsWithChildren, useMemo } from 'react';
import { assertValidOpenDeskModuleConfig, Navbar } from '../Navbar';

export function NavbarBanner({ children }: PropsWithChildren<{}>) {
  const bannerConfig = useMemo(() => {
    const config = {
      banner: {
        ics_navigation_json_url: getEnvironment(
          'REACT_APP_OPENDESK_BANNER_ICS_NAVIGATION_JSON_URL',
        ),
        ics_silent_url: getEnvironment(
          'REACT_APP_OPENDESK_BANNER_ICS_SILENT_URL',
        ),
        portal_logo_svg_url: getEnvironment(
          'REACT_APP_OPENDESK_BANNER_PORTAL_LOGO_SVG_URL',
        ),
        portal_url: getEnvironment('REACT_APP_OPENDESK_BANNER_PORTAL_URL'),
      },
    };

    assertValidOpenDeskModuleConfig(config);

    return config.banner;
  }, []);

  return <Navbar config={bannerConfig}>{children}</Navbar>;
}
