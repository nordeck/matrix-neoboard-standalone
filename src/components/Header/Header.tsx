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
import { UserMenu } from './UserMenu';
import neoBoardLogo from './neoboard-logo.png';

const StyledHeader = styled('nav')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '34px',
  paddingTop: '34px',
}));

type HeaderProps = {
  onLogoClick: () => void;
};

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <StyledHeader>
      <div style={{ cursor: 'pointer' }} role="button" onClick={onLogoClick}>
        <img
          height="35"
          src={neoBoardLogo}
          alt={t('app.logo', 'NeoBoard Logo')}
        />
      </div>
      <UserMenu />
    </StyledHeader>
  );
}
