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

import WebAssetOffIcon from '@mui/icons-material/WebAssetOff';
import { Button, Container, styled, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

const BoardNotFoundContainer = styled(Container)({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '15vh',
});

export const BoardNotFound: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <BoardNotFoundContainer>
      <WebAssetOffIcon
        style={{ color: theme.palette.text.secondary, fontSize: 128 }}
      />

      <Typography
        variant="h1"
        color="textSecondary"
        sx={{ marginBottom: '64px', marginTop: '16px' }}
      >
        {t('boardNotFound.message', 'Board not found')}
      </Typography>

      <Link to="/dashboard">
        <Button variant="contained">
          {t('boardNotFound.link', 'Go to dashboard')}
        </Button>
      </Link>
    </BoardNotFoundContainer>
  );
};
