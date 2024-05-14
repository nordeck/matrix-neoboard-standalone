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

import { Grid, Typography, styled } from '@mui/material';

import WelcomeBackground from './welcome-background.svg';

export const WelcomeWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  height: '100vh',
}));

export const WelcomeGrid = styled(Grid)(({ theme }) => ({
  height: '100%',
  gridGap: 0,
}));

export const WelcomeGridLeftPane = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  [theme.breakpoints.down('sm')]: {
    minHeight: '128px',
  },
  backgroundImage: `url(${WelcomeBackground})`,
  backgroundSize: 'cover',
}));

export const WelcomeGridRightPane = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: '100%',
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
  },
}));

export const WelcomeLogoGridWrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5),
  },
}));

export const WelcomeGridSymbols = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const WelcomeText = styled(Typography)(({ theme }) => ({
  fontSize: 40,
  fontWeight: 700,
  textTransform: 'uppercase',
  alignContent: 'center',
}));
