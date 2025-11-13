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
import { KeyboardEventHandler, MouseEventHandler } from 'react';
import { NavigationJson } from './navigationJson';

type Props = {
  navigationJson: NavigationJson;
  onClick: MouseEventHandler;
  onKeyDown: KeyboardEventHandler;
};

const Root = styled('div')({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 8008,
});

const List = styled('ul')(({ theme }) => ({
  backgroundColor: theme.navbar.color.bgCanvasDefault,
  borderTop: `4px solid ${theme.navbar.color.textActionAccent}`,
  borderRadius: 8,
  boxShadow: '4px 4px 12px 0 rgba(118, 131, 156, 0.6)',
  left: 24,
  listStyle: 'none',
  margin: 0,
  padding: '4px 0 20px',
  position: 'absolute',
  top: theme.navbar.height,
  width: 272,
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
  height: 20,
  marginRight: 8,
  width: 20,
});

const PlaceholderIcon = styled('div')({
  height: 20,
  marginRight: 8,
  width: 20,
});

export function Menu({ navigationJson, onClick, onKeyDown }: Props) {
  return (
    <Root data-testid="menu-backdrop" onClick={onClick}>
      <List data-testid="menu-list" onKeyDown={onKeyDown}>
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
    </Root>
  );
}
