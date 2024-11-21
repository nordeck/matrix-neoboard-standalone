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
import { PropsWithChildren } from 'react';
import { Header } from './Header';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.chrome,
  height: '100vh',
  paddingLeft: '25px',
  paddingRight: '25px',
  paddingBottom: '25px',
}));

const ContentWrapper = styled('div')(() => ({
  borderRadius: '8px',
}));

type LoggedInLayoutProps = PropsWithChildren<{}> & {
  onLogoClick: () => void;
  title: string;
  selectedRoomId?: string;
};

export function LoggedInLayout({
  children,
  onLogoClick,
  title,
  selectedRoomId,
}: LoggedInLayoutProps) {
  return (
    <Wrapper>
      <Header
        onLogoClick={onLogoClick}
        title={title}
        selectedRoomId={selectedRoomId}
      />
      <ContentWrapper role="main">{children}</ContentWrapper>
    </Wrapper>
  );
}
