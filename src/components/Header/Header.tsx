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
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import { InvitesMenu } from './InvitesMenu';
import { NeoBoardIcon } from './NeoBoardIcon';
import { ShareMenu } from './ShareMenu';
import { UserMenu } from './UserMenu';

const StyledHeader = styled('nav')(() => ({
  alignItems: 'center',
  display: 'flex',
  gap: '16px',
  paddingBottom: '34px',
  paddingTop: '34px',
  height: '10vh',
}));

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  flexGrow: 1,
  fontSize: '25px',
  fontWeight: '600',
  overflow: 'hidden',
  position: 'relative',
  textOverflow: 'ellipsis',
  top: '-4px',
  whiteSpace: 'nowrap',
}));

const TitleWrapper = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  gap: '16px',
}));

const MenuWrapper = styled('div')(() => ({
  display: 'flex',
  gap: '8px',
}));

type HeaderProps = {
  title: string;
  onLogoClick: () => void;
  selectedRoomId?: string;
};

export function Header({ onLogoClick, title, selectedRoomId }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <TitleWrapper>
        <div
          style={{ cursor: 'pointer' }}
          role="button"
          onClick={onLogoClick}
          aria-label={t('header.dashboard', 'Go back to the dashboard')}
        >
          <NeoBoardIcon onClick={onLogoClick} />
        </div>
        <Title>{title}</Title>
      </TitleWrapper>
      <MenuWrapper>
        {selectedRoomId && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ShareMenu selectedRoomId={selectedRoomId} />
            </Suspense>
          </ErrorBoundary>
        )}
        <InvitesMenu />
        <UserMenu />
      </MenuWrapper>
    </StyledHeader>
  );
}
