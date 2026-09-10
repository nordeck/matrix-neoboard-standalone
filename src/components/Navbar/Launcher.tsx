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

type Props = {
  ariaExpanded: boolean;
  ariaLabel: string;
  onClick: () => void;
};

const Root = styled('button')(({ theme, 'aria-expanded': ariaExpanded }) => ({
  alignItems: 'center',
  backgroundColor: ariaExpanded
    ? theme.palette.primary.dark
    : theme.navbar.color.textActionAccent,
  '&:hover': {
    color: theme.navbar.color.iconOnSolidPrimary,
    backgroundColor: theme.palette.primary.main,
  },
  border: 'none',
  color: ariaExpanded
    ? theme.navbar.color.iconOnSolidPrimary
    : theme.navbar.color.textPrimary,
  cursor: 'pointer',
  display: 'flex',
  padding: '0 25px',
  height: '100%',
}));

export function Launcher({ ariaExpanded, ariaLabel, onClick }: Props) {
  return (
    <Root
      aria-expanded={ariaExpanded}
      aria-haspopup={true}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <svg fill="currentColor" height="20" width="20">
        <circle cx="2.5" cy="2.5" r="2.5" />
        <circle cx="10" cy="2.5" r="2.5" />
        <circle cx="17.5" cy="2.5" r="2.5" />
        <circle cx="2.5" cy="10" r="2.5" />
        <circle cx="10" cy="10" r="2.5" />
        <circle cx="17.5" cy="10" r="2.5" />
        <circle cx="2.5" cy="17.5" r="2.5" />
        <circle cx="10" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    </Root>
  );
}
