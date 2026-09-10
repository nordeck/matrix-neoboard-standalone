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

import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, styled } from '@mui/material';
import { HTMLAttributes, KeyboardEventHandler, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo.tsx';
import { BannerConfig } from './config.ts';
import { NavigationJson } from './navigationJson';

type Props = {
  navigationJson: NavigationJson;
  onClick: MouseEventHandler;
  onKeyDown: KeyboardEventHandler;
  config: BannerConfig;
  open: boolean;
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.navbar.color.bgCanvasDefault,
    borderRadius: '0 16px 16px 0',
    boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.1)',
    width: 320,
  },
}));

const List = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: '4px 0 20px',
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  width: 32,
  height: 32,
  padding: 0,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.navbar.color.textActionAccent,
  },
  '&:active': {
    backgroundColor: '#D3D7DE',
  },
  '&:focus': {
    border: `3px solid ${theme.palette.background.card}`,
  },
}));

const Heading = styled('span')({
  display: 'block',
  fontWeight: 'bold',
  margin: '20px 24px 8px',
});

const Sublist = styled('ul')({
  listStyle: 'none',
  padding: 0,
});

const Link = styled('a')(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f8fa',
  },
  '&:hover, &:link, &:visited': {
    textDecoration: 'none',
  },
  alignItems: 'center',
  color: theme.navbar.color.textPrimary,
  display: 'flex',
  padding: '4px 24px',
}));

const Icon = styled('img')({
  height: 25,
  marginRight: 8,
  width: 25,
});

const PlaceholderIcon = styled('div')({
  height: 25,
  marginRight: 8,
  width: 25,
});

export function Menu({
  navigationJson,
  onClick,
  onKeyDown,
  config,
  open,
}: Props) {
  const { t } = useTranslation();
  return (
    <StyledDrawer
      anchor="left"
      open={open}
      aria-label={t('navbar.menuLabel', 'Navigation menu')}
      slotProps={{
        backdrop: {
          'data-testid': 'menu-backdrop',
          onClick,
        } as HTMLAttributes<HTMLDivElement>,
      }}
    >
      <List data-testid="menu-list" onKeyDown={onKeyDown}>
        <li>
          <CloseButton
            aria-label={t('navbar.closeMenu', 'Close menu')}
            data-testid="menu-close-button"
            disableRipple
            onClick={onClick}
          >
            <CloseIcon />
          </CloseButton>
          <Logo
            alt={t('navbar.portalLogo', 'Portal logo')}
            ariaLabel={t('navbar.showPortal', 'Show portal')}
            href={config.portal_url}
            src={config.portal_logo_svg_url}
            width={config.portal_logo_width}
          />
        </li>
        {navigationJson.categories.map((category) => (
          <li key={category.identifier}>
            <Heading>{category.display_name}</Heading>
            <Sublist>
              {category.entries.map((entry) => (
                <li key={entry.identifier}>
                  <Link href={entry.link} target={entry.target}>
                    {entry.icon_url ? (
                      <Icon
                        alt={entry.display_name}
                        role="presentation"
                        src={entry.icon_url}
                      />
                    ) : (
                      <PlaceholderIcon />
                    )}
                    <span>{entry.display_name}</span>
                  </Link>
                </li>
              ))}
            </Sublist>
          </li>
        ))}
      </List>
    </StyledDrawer>
  );
}
