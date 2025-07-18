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
import { Link } from 'react-router';
import ErrorBoundary from '../ErrorBoundary';
import { InvitesMenu } from './InvitesMenu';
import { NeoBoardIcon } from './NeoBoardIcon';
import { ShareMenu } from './ShareMenu';
import { Title } from './Title';
import { UserMenu } from './UserMenu';

const StyledHeader = styled('nav')(() => ({
  alignItems: 'center',
  display: 'flex',
  gap: '16px',
  paddingBottom: '34px',
  paddingTop: '34px',
  paddingLeft: '25px',
  paddingRight: '25px',
  height: '10vh',
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
  roomId?: string;
};

export function Header({ title, roomId }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <TitleWrapper>
        <Link to="/dashboard">
          <div
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={t('header.dashboard', 'Go back to the dashboard')}
          >
            <NeoBoardIcon />
          </div>
        </Link>
        <Title title={title} roomId={roomId} />
      </TitleWrapper>
      <MenuWrapper>
        {roomId && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ShareMenu roomId={roomId} />
            </Suspense>
          </ErrorBoundary>
        )}
        <InvitesMenu />
        <UserMenu />
      </MenuWrapper>
    </StyledHeader>
  );
}
