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

import { styled } from '@mui/material';
import {
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import FocusLock from 'react-focus-lock';
import { useTranslation } from 'react-i18next';
import { BannerConfig } from './config';
import { Launcher } from './Launcher';
import { Logo } from './Logo';
import { Menu } from './Menu';
import { NavigationJson, assertValidNavigationJson } from './navigationJson';
import { SilentLogin } from './SilentLogin';

const Root = styled('nav')(({ theme }) => ({
  backgroundColor: theme.navbar.color.bgCanvasDefault,
  borderBottom: '1px solid rgba(27, 29, 34, 0.1)',
  display: 'flex',
  alignItems: 'center',
  height: theme.navbar.height,
  paddingRight: 19,
}));

type Props = PropsWithChildren<{
  config: BannerConfig;
}>;

export function Navbar({ config, children }: Props) {
  const { t, i18n } = useTranslation();
  const [ariaExpanded, setAriaExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigationJson, setNavigationJson] = useState<NavigationJson>();

  useEffect(() => {
    async function fetchNavigationJson() {
      const url = new URL(config.ics_navigation_json_url);
      url.search = `?language=${i18n.language}`;

      try {
        const response = await fetch(url.toString(), {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          assertValidNavigationJson(data);
          setNavigationJson(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (loggedIn) {
      void fetchNavigationJson();
    }
  }, [config.ics_navigation_json_url, i18n.language, loggedIn]);

  const handleAriaExpanded = () => {
    setAriaExpanded(!ariaExpanded);
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    handleAriaExpanded();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape') {
      handleAriaExpanded();
    }
  };

  const handleLoggedIn = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };

  return (
    <Root>
      <Logo
        alt={t('navbar.portalLogo', 'Portal logo')}
        ariaLabel={t('navbar.showPortal', 'Show portal')}
        href={config.portal_url}
        src={config.portal_logo_svg_url}
      />
      {loggedIn ? (
        navigationJson && (
          <>
            <Launcher
              ariaExpanded={ariaExpanded}
              ariaLabel={t('navbar.showMenu', 'Show menu')}
              onClick={handleAriaExpanded}
            />
            {ariaExpanded && (
              <FocusLock>
                <Menu
                  navigationJson={navigationJson}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                />
              </FocusLock>
            )}
          </>
        )
      ) : (
        <SilentLogin onLoggedIn={handleLoggedIn} url={config.ics_silent_url} />
      )}
      {children}
    </Root>
  );
}
