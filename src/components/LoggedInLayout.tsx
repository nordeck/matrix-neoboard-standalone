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
import { t } from 'i18next';
import { PropsWithChildren } from 'react';
import neoBoardLogo from './neoboard-logo.png';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100vh',
  paddingLeft: '25px',
  paddingRight: '25px',
}));

const ContentWrapper = styled('div')(() => ({
  borderRadius: '8px',
}));

const Header = styled('div')(() => ({
  paddingBottom: '34px',
  paddingTop: '34px',
}));

type LoggedInLayoutProps = PropsWithChildren<{}> & {
  onLogoClick: () => void;
};

export function LoggedInLayout({ children, onLogoClick }: LoggedInLayoutProps) {
  return (
    <Wrapper>
      <Header>
        <div style={{ cursor: 'pointer' }} role="button" onClick={onLogoClick}>
          <img
            height="35"
            src={neoBoardLogo}
            alt={t('app.logo', 'NeoBoard Logo')}
          />
        </div>
      </Header>
      <ContentWrapper role="main">{children}</ContentWrapper>
    </Wrapper>
  );
}
