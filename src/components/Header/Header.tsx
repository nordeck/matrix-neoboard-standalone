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
