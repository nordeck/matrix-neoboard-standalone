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

import { styled } from '@mui/material';
import { t } from 'i18next';
import { NeoBoardIcon } from './NeoBoardIcon';
import { UserMenu } from './UserMenu';

const StyledHeader = styled('nav')(() => ({
  alignItems: 'center',
  display: 'flex',
  gap: '16px',
  paddingBottom: '34px',
  paddingTop: '34px',
}));

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '25px',
  fontWeight: '600',
  overflow: 'hidden',
  position: 'relative',
  textOverflow: 'ellipsis',
  top: '-4px',
  whiteSpace: 'nowrap',
}));

type HeaderProps = {
  title: string;
  onLogoClick: () => void;
};

export function Header({ onLogoClick, title }: HeaderProps) {
  return (
    <StyledHeader>
      <div
        style={{ cursor: 'pointer' }}
        role="button"
        onClick={onLogoClick}
        aria-label={t('header.dashboard', 'Go back to the dashboard')}
      >
        <NeoBoardIcon onClick={onLogoClick} />
      </div>
      <Title>{title}</Title>
      <UserMenu />
    </StyledHeader>
  );
}
