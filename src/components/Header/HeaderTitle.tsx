/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { getEnvironmentAppearance } from '../../lib';
import { Title } from './Title.tsx';

const TitleWrapper = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  gap: '16px',
}));

type Props = {
  title: string;
  roomId?: string;
  homeIcon: React.ReactNode;
  hasPadding?: boolean;
};

const appearance = getEnvironmentAppearance();

const ButtonStyled = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  lineHeight: 0,
  ...(appearance === 'opendesk' && {
    color: theme.navbar.color.textPrimary,
    '&:active': {
      color: theme.navbar.color.textActionAccent,
    },
  }),
}));

export function HeaderTitle({ title, roomId, homeIcon, hasPadding }: Props) {
  const { t } = useTranslation();

  return (
    <TitleWrapper
      sx={{ ...(hasPadding ? { paddingLeft: '16px' } : undefined) }}
    >
      <Link to="/dashboard">
        <ButtonStyled
          role="button"
          aria-label={t('header.dashboard', 'Go back to the dashboard')}
        >
          {homeIcon}
        </ButtonStyled>
      </Link>
      <Title title={title} roomId={roomId} />
    </TitleWrapper>
  );
}
