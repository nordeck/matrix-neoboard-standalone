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

import { styled, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { getEnvironmentAppearance } from '../../lib';

const appearance = getEnvironmentAppearance();

const TitleWrapper = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  gap: '16px',
  justifyContent: 'flex-start',
}));

type Props = {
  title: string;
  homeIcon: React.ReactNode;
  hasPadding?: boolean;
};

const ButtonStyled = styled('div')({
  cursor: 'pointer',
  alignItems: 'center',
  display: 'flex',
  gap: '16px',
});

const ProductName = styled(Typography)(({ theme }) => ({
  ...(appearance === 'opendesk'
    ? { color: theme.navbar.color.textPrimary }
    : { color: theme.palette.primary.main }),
  fontSize: '25px',
  fontWeight: '600',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export function HeaderTitle({ title, homeIcon, hasPadding }: Props) {
  const { t } = useTranslation();

  return (
    <TitleWrapper
      sx={{ ...(hasPadding ? { paddingLeft: '16px' } : undefined) }}
    >
      <Link style={{ textDecoration: 'none' }} to="/dashboard">
        <Tooltip title={t('header.dashboard', 'Go back to the dashboard')}>
          <ButtonStyled
            role="button"
            aria-label={t('header.dashboard', 'Go back to the dashboard')}
          >
            {homeIcon}
            <ProductName>{title}</ProductName>
          </ButtonStyled>
        </Tooltip>
      </Link>
    </TitleWrapper>
  );
}
