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

import { CircularProgress, Typography, styled } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const StyledStartingView = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

export const StartingView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <StyledStartingView>
      <CircularProgress />
      <Typography variant="h6" color="textPrimary">
        {t('welcome.loading', 'Starting…')}
      </Typography>
    </StyledStartingView>
  );
};
