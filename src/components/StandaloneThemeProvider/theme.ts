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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { ThemeOptions } from '@mui/material';

const fontFamily = [
  'Roboto',
  'Inter',
  'Noto Sans',
  'Ubuntu',
  'Cantarel',
  'Arial',
  'Helvetica',
  'sans-serif',
  'Twemoji',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Noto Color Emoji"',
].join(',');

const lightPrimaryColor = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR',
  '#e85e10',
);

const lightPrimaryColorLight = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR_LIGHT',
  '#ff8a42',
);

const lightPrimaryColorDark = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR_DARK',
  '#b52e00',
);

const lightBackgroundLoggedIn = getEnvironment(
  'REACT_APP_LIGHT_BACKGROUND_LOGGED_IN',
  '#fcf9f3',
);

const lightBackgroundCard = getEnvironment(
  'REACT_APP_LIGHT_BACKGROUND_CARD',
  '#fce2cf',
);

export const standaloneLightTheme: ThemeOptions = {
  palette: {
    primary: {
      main: lightPrimaryColor,
      light: lightPrimaryColorLight,
      dark: lightPrimaryColorDark,
    },
    background: {
      loggedIn: lightBackgroundLoggedIn,
      card: lightBackgroundCard,
      paper: '#fff',
    },
  },
  typography: {
    fontFamily,
  },
};
