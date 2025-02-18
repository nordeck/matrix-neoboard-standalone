/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
