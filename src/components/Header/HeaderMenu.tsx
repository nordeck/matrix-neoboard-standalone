/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
import ErrorBoundary from '../ErrorBoundary.tsx';
import { InvitesMenu } from './InvitesMenu.tsx';
import { ShareMenu } from './ShareMenu.tsx';
import { MembersMenu } from './MembersMenu.tsx';
import { UserMenu } from './UserMenu.tsx';

const MenuWrapper = styled('div')(() => ({
  display: 'flex',
  gap: '8px',
}));

type Props = {
  roomId?: string;
};

export function HeaderMenu({ roomId }: Props) {
  return (
    <MenuWrapper>
      {roomId && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ShareMenu roomId={roomId} />
          </Suspense>
        </ErrorBoundary>
      )}
      <InvitesMenu />
      <MembersMenu roomId={roomId} />
      <UserMenu />
    </MenuWrapper>
  );
}