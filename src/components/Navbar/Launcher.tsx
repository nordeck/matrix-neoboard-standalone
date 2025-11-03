// SPDX-License-Identifier: AGPL-3.0-or-later

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
    ? theme.navbar.color.textActionAccent
    : 'transparent',
  border: 'none',
  color: ariaExpanded
    ? theme.navbar.color.iconOnSolidPrimary
    : theme.navbar.color.textPrimary,
  cursor: 'pointer',
  display: 'flex',
  padding: '0 22px',
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
      <svg fill="currentColor" height="16" width="16">
        <path d="M0 4h4V0H0v4Zm6 12h4v-4H6v4Zm-6 0h4v-4H0v4Zm0-6h4V6H0v4Zm6 0h4V6H6v4Zm6-10v4h4V0h-4ZM6 4h4V0H6v4Zm6 6h4V6h-4v4Zm0 6h4v-4h-4v4Z" />
      </svg>
    </Root>
  );
}
