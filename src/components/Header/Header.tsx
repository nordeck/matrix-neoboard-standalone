/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
  selectedRoomId?: string;
};

export function Header({ title, selectedRoomId }: HeaderProps) {
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
        <Title title={title} selectedRoomId={selectedRoomId} />
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
