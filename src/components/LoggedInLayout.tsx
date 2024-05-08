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
