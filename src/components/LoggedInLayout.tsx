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
