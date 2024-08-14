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

import { Grid, Typography, styled } from '@mui/material';

import WelcomeBackground from './welcome-background.svg';

export const WelcomeWrapper = styled('div')({
  flexGrow: 1,
  height: '100vh',
});

export const WelcomeGrid = styled(Grid)({
  height: '100%',
  gridGap: 0,
});

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

export const WelcomeText = styled(Typography)({
  fontSize: 40,
  fontWeight: 700,
  textTransform: 'uppercase',
  alignContent: 'center',
});
